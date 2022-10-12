import Users from "../models/User.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import {Op} from "sequelize";

export const index = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Users.count({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {username:{
                [Op.like]: '%'+search+'%'
            }}, {email:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        order: [['id', 'DESC']]
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Users.findAll({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {username:{
                [Op.like]: '%'+search+'%'
            }}, {email:{
                [Op.like]: '%'+search+'%'
            }}]
        },
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
};

export const store = async (req, res) => {
    const {name, username, email, no_hp, address, password, confirmPassword, role, status} = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Konfirmasi Password Harus Sama!"});
    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/user_photos/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format gambar yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file gambar sebesar 5MB"});
        file.mv(`./public/documents/user_photos/${fileName}`);

        photo = fileName;
        url_photo = url;
    }else{
        photo = null;
        url_photo = null;
    }
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name,
            username,
            email,
            no_hp,
            address,
            password: hashPassword,
            role,
            status,
            photo,
            url: url_photo
        });
        res.status(201).json({msg: "Pembuatan User Berhasil!"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};

export const detail = async (req, res) => {
    try {
        const response = await Users.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!response) return res.status(400).json({msg: "User tidak ditemukan!"}); 
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(400).json({msg: "User tidak ditemukan!"});

    const {name, username, email, no_hp, address, password, confirmPassword, role, status} = req.body;

    let hashPassword;
    if (password === "" || password === null || !password) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if(password !== confirmPassword) return res.status(400).json({msg: "Password dan Konfirmasi Password Harus Sama!"});

    let photo, url_photo;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/user_photos/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format gambar yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file gambar sebesar 5MB"});

        if (user.photo) {
            const filePath = `./public/documents/user_photos/${user.photo}`;
            fs.unlinkSync(filePath);
        }
        
        file.mv(`./public/documents/user_photos/${fileName}`, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });

        photo = fileName;
        url_photo = url;
    }else{
        photo = user.photo;
        url_photo = user.url;
    }

    try {
        await Users.update({
           name,
           username,
           email,
           no_hp,
           address,
           password: hashPassword,
           role,
           status,
           photo,
           url: url_photo
        },{
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User berhasil diupdate!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const destroy = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(400).json({msg: "User tidak ditemukan!"});
    try {
        if (user.photo) {
            const filePath = `./public/documents/user_photos/${user.photo}`;
            fs.unlinkSync(filePath);   
        }
        await Users.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}