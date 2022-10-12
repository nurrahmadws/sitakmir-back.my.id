import Content from "../models/Content.js";
import Categories from "../models/Category.js";
import Users from "../models/User.js";
import Slug from "../config/Slug.js";
import path from "path";
import fs from "fs";
import {Op} from "sequelize";

export const index_about_us = async (req, res) => {
    try {
        const about_us = await Content.findOne({
            where: {
                slug: 'about-us'
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!about_us) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(about_us);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const index_contact_us = async (req, res) => {
    try {
        const contact_us = await Content.findOne({
            where: {
                slug: 'contact-us'
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!contact_us) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(contact_us);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const index_app_setting = async (req, res) => {
    try {
        const app_setting = await Content.findOne({
            where: {
                slug: 'setting-app'
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!app_setting) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(app_setting);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const index_management = async (req, res) => {
    try {
        const pengurus = await Content.findOne({
            where: {
                slug: 'pengurus'
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!pengurus) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(pengurus);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const main_index = async (req, res) => {
    try {
        const article = await Content.findAll({
            where: {
                slug: {
                    [Op.notIn]: ['about-us', 'contact-us', 'pengurus', 'setting-app']
                }
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!article) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const index_announcement = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Content.count({
        where: {
            title: {
                [Op.like]: '%'+search+'%'
            }
        },
        include: [
            {
                model: Categories,
                attributes: ['id', 'name'],
                where: {
                    slug: 'pengumuman'
                }
            },
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
    const result = await Content.findAll({
        where: {
            title: {
                [Op.like]: '%'+search+'%'
            }
        },
        include: [
            {
                model: Categories,
                attributes: ['id', 'name', 'slug'],
                where: {
                    slug: 'pengumuman'
                }
            },
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
    // console.log(req.body)
    const {category_id, title, description, saldo_awal} = req.body;
    let slug = Slug(title);
    if (req.body.slug) {
        slug = req.body.slug;
    } else {
        slug = Slug(title);
    }
    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = slug + file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/content/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});
        file.mv(`./public/documents/content/${fileName}`);

        photo = fileName;
        url_photo = url;
    }else{
        photo = null;
        url_photo = null;
    }
    try {
        await Content.create({
            category_id,
            title,
            slug,
            description,
            status: 'Publish',
            created_by: req.userId,
            updated_by: req.userId,
            photo,
            url: url_photo,
            saldo_awal
        });
        res.status(201).json({msg: "Data berhasil ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const detail = async (req, res) => {
    try {
        const response = await Content.findOne({
            where: {
                slug: req.params.slug
            },
            include: [
                {
                    model: Categories,
                    attributes: ['id', 'name']
                },
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
        if(!response) return res.status(404).json({msg: "Tidak ada data"});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const response = await Content.findOne({
        where: {
            slug: req.params.slug
        }
    });
    if(!response) return res.status(404).json({msg: "Tidak ada data"});
    const {category_id, title, description, status, saldo_awal} = req.body;
    let slug = Slug(title);
    if (req.body.slug) {
        slug = req.body.slug;
    } else {
        slug = Slug(title);
    }
    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = slug + file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/content/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format gambar yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file gambar sebesar 5MB"});

        if (response.photo) {
            const filePath = `./public/documents/content/${response.photo}`;
            fs.unlinkSync(filePath);
        }
        
        file.mv(`./public/documents/content/${fileName}`, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });

        photo = fileName;
        url_photo = url;
    }else{
        photo = response.photo;
        url_photo = response.url;
    }

    try {
        await Content.update({
            category_id,
            title,
            slug,
            description,
            status,
            updated_by: req.userId,
            photo,
            url: url_photo,
            saldo_awal
        },{
            where: {
                slug: req.params.slug
            }
        });
        res.status(200).json({msg: "Data berhasil diperbaharui"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const destroy = async (req, res) => {
    const response = await Content.findOne({
        where: {
            slug: req.params.slug
        }
    });
    if(!response) return res.status(404).json({msg: "Tidak ada data"});
    try {
        if (response.photo) {
            const filePath = `./public/documents/content/${response.photo}`;
            fs.unlinkSync(filePath);
        }
        await Content.destroy({
            where: {
                slug: req.params.slug
            }
        });
        res.status(200).json({msg: "Data berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}