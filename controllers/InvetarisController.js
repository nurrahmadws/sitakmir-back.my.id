import Invetaris from "../models/Inventaris.js";
import Categories from "../models/Category.js";
import Users from "../models/User.js";
import {Op} from "sequelize";

export const index = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Invetaris.count({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {procurement_time:{
                [Op.like]: '%'+search+'%'
            }}]
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
        ],
        order: [['id', 'DESC']]
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Invetaris.findAll({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {procurement_time:{
                [Op.like]: '%'+search+'%'
            }}]
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

export const ordinaryIndex = async (req, res) => {
    try {
        const result = await Invetaris.findAll({
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
            ],
            order: [['id', 'DESC']],
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const store = async (req, res) => {
    const {category_id, title, procurement_time, stock, unit, condition, description, estimated_total_price} = req.body;
    try {
        await Invetaris.create({
            category_id,
            title,
            procurement_time,
            stock,
            unit,
            condition,
            description,
            estimated_total_price,
            created_by: req.userId,
            updated_by: req.userId
        });
        res.status(201).json({msg: "Data berhasil ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const detail = async (req, res) => {
    try {
        const inventaris = await Invetaris.findOne({
            where: {
                id: req.params.id
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
        if(!inventaris) return res.status(404).json({msg: 'Data tidak ditemukan'});
        res.status(200).json(inventaris);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const inventaris = await Invetaris.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!inventaris) return res.status(404).json({msg: 'Data tidak ditemukan'});
    const {category_id, title, procurement_time, stock, unit, condition, description, estimated_total_price} = req.body;
    try {
        await Invetaris.update({
            category_id,
            title,
            procurement_time,
            stock,
            unit,
            condition,
            description,
            estimated_total_price,
            updated_by: req.userId
        },{
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Data berhasil diperbaharui"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const destroy = async (req, res) => {
    const inventaris = await Invetaris.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!inventaris) return res.status(404).json({msg: 'Data tidak ditemukan'});
    try {
        await Invetaris.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Data berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}