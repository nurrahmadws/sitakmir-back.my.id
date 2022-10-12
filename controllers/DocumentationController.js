import Documentation from "../models/Documentation.js";
import Users from "../models/User.js";
import Slug from "../config/Slug.js";
import path from "path";
import fs from "fs";

export const index = async (req, res) => {
    try {
        const response = await Documentation.findAll({
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
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const store = async (req, res) => {
    const {title, date, location, description} = req.body;
    const slug = Slug(title);
    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/documentation/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});
        file.mv(`./public/documents/documentation/${fileName}`);

        photo = fileName;
        url_photo = url;
    }else{
        photo = null;
        url_photo = null;
    }

    try {
        await Documentation.create({
            title,
            slug,
            date,
            location,
            description,
            created_by: req.userId,
            updated_by: req.userId,
            photo,
            url: url_photo,
        });
        res.status(201).json({msg: "Data berhasil ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const detail = async (req, res) => {
try {
    const response = await Documentation.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});
    res.status(200).json(response);
} catch (error) {
    res.status(500).json({msg: error.message});
}
};

export const update = async (req, res) => {
    const response = await Documentation.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});
    const {title, date, location, description} = req.body;
    const slug = Slug(title);
    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/documentation/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});

        if (response.photo) {
            const filePath = `./public/documents/documentation/${response.photo}`;
            fs.unlinkSync(filePath);
        }

        file.mv(`./public/documents/documentation/${fileName}`);

        photo = fileName;
        url_photo = url;
    }else{
        photo = null;
        url_photo = null;
    }

    try {
        await Documentation.update({
            title,
            slug,
            date,
            location,
            description,
            created_by: req.userId,
            updated_by: req.userId,
            photo,
            url: url_photo,
        },{
            where: {
                id:req.params.id
            }
        });
        res.status(201).json({msg: "Data berhasil diupdate"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const destroy = async (req, res) => {
    const response = await Documentation.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});

    try {
        if (response.photo) {
            const filePath = `./public/documents/documentation/${response.photo}`;
            fs.unlinkSync(filePath);   
        }
        await Documentation.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Data berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};