import Study from "../models/Study.js";
import Users from "../models/User.js";
import Slug from "../config/Slug.js";
import path from "path";
import fs from "fs";
import {Op} from "sequelize";

export const index = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Study.count({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {presenter:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        include: [
            {
                model: Users,
                as: 'user_created',
                attributes: ['id', 'name', 'username', 'email']
            },
            {
                model: Users,
                as: 'user_updated',
                attributes: ['id', 'name', 'username', 'email']
            }
        ],
        order: [['id', 'DESC']]
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Study.findAll({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {presenter:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        include: [
            {
                model: Users,
                as: 'user_created',
                attributes: ['id', 'name', 'username', 'email']
            },
            {
                model: Users,
                as: 'user_updated',
                attributes: ['id', 'name', 'username', 'email']
            }
        ],
        order: [['id', 'DESC']],
        offset,
        limit
    });

    res.json({
        result,
        page,
        limit,
        totalRows,
        totalPage
    });
}

export const store = async (req, res) => {
    const {flag, title, presenter, day, location, description, imam, muadzin} = req.body;
    const slug = Slug(title);
    let poster, url_poster;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/study/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});
        file.mv(`./public/documents/study/${fileName}`);

        poster = fileName;
        url_poster = url;
    }else{
        poster = null;
        url_poster = null;
    }

    try {
        await Study.create({
            flag,
            title,
            slug,
            presenter,
            day,
            location,
            description,
            created_by: req.userId,
            updated_by: req.userId,
            poster,
            url: url_poster,
            imam,
            muadzin
        });
        res.status(201).json({msg: "Data berhasil ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const detail = async (req, res) => {
    try {
        const response = await Study.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Users,
                    as: 'user_created',
                    attributes: ['id', 'name', 'username', 'email']
                },
                {
                    model: Users,
                    as: 'user_updated',
                    attributes: ['id', 'name', 'username', 'email']
                }
            ]
        });
        if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const studd = await Study.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!studd) return res.status(404).json({msg: "Data tidak ditemukan"});
    const {flag, title, presenter, day, location, description, imam, muadzin} = req.body;
    const slug = Slug(title);

    let poster, url_poster;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/study/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});

        if (studd.poster) {
            const filePath = `./public/documents/study/${studd.poster}`;
            fs.unlinkSync(filePath);
        }

        file.mv(`./public/documents/study/${fileName}`, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });

        poster = fileName;
        url_poster = url;
    }else{
        poster = studd.poster;
        url_poster = studd.url;
    }

    try {
        await Study.update({
            flag,
            title,
            slug,
            presenter,
            day,
            location,
            description,
            updated_by: req.userId,
            poster,
            url: url_poster,
            imam,
            muadzin
        },{
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({msg: "Data berhasil diupdate"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const destroy = async (req, res) => {
    const response = await Study.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});
    try {
        if (response.poster) {
            const filePath = `./public/documents/study/${response.poster}`;
            fs.unlinkSync(filePath);   
        }
        await Study.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Data berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}