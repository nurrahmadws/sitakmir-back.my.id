import Categories from "../models/Category.js";
import Users from "../models/User.js";
import Slug from "../config/Slug.js";
import {Op} from "sequelize";

export const index = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Categories.count({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {tier:{
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
    const result = await Categories.findAll({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {tier:{
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

export const list_by_tier = async (req, res) => {
    try {
        const response = await Categories.findAll({
            where: {
                tier: req.params.tier
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
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const store = async (req, res) => {
    const {tier, name, status} = req.body;
    const slug = Slug(name);
    try {
        await Categories.create({
            tier,
            name,
            slug,
            status,
            created_by: req.userId,
            updated_by: req.userId
        });
        res.status(201).json({msg: "Kategori berhasil ditambahkan!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const detail = async (req, res) => {
    try {
        const catt = await Categories.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!catt) return res.status(404).json({msg: 'Data tidak ditemukan'});
        res.status(200).json(catt);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const category = await Categories.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!category) return res.status(404).json({msg: 'Kategori tidak ditemukan!'});
    const {tier, name, status} = req.body;
    const slug = Slug(name);

    try {
        await Categories.update({
            tier,
            name,
            slug,
            status,
            updated_by: req.userId
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Kategori berhasil diperbaharui!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const destroy = async (req, res) => {
    const category = await Categories.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!category) return res.status(404).json({msg: 'Kategori tidak ditemukan!'});
    try {
        await Categories.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Kategori berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}