import Transactions from "../models/Transactions.js";
import Users from "../models/User.js";
import Categories from "../models/Category.js";
import Content from "../models/Content.js";
import path from "path";
import fs from "fs";
import {Op, Sequelize} from "sequelize";
import getYear from "date-fns/getYear/index.js";
import getMonth from "date-fns/getMonth/index.js";
import {parseISO, lastDayOfMonth} from "date-fns";

export const FormatDate2 = (date_val) => {
    const date_sign = new Date(date_val);
    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(date_sign);
    const custom_date = `${ye}-${mo}-${da}`;
    return custom_date;
}

export const index = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const full = req.query.date;
    const full_last = lastDayOfMonth(parseISO(req.query.date));

    const totalRows = await Transactions.count({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {date:{
                [Op.like]: '%'+search+'%'
            }}],
            date: {[Op.between]: [full, FormatDate2(full_last)]}
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
        order: [['date', 'ASC']]
    });

    const totalPage = Math.ceil(totalRows / limit);

    const result = await Transactions.findAll({
        where: {
            [Op.or]: [{title: {
                [Op.like]: '%'+search+'%'
            }}, {date:{
                [Op.like]: '%'+search+'%'
            }}],
            date: {[Op.between]: [full, FormatDate2(full_last)]}
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
        offset,
        limit,
        order: [
            ['date', 'ASC']
        ],
    });
    // const sum_income = await Transactions.sum('nominal', {where: {category_id: 1}});
    // const sum_spending = await Transactions.sum('nominal', {where: {category_id: 3}});

    res.json({
        result,
        page,
        limit,
        totalRows,
        totalPage,
        // sum_income,
        // sum_spending,
    });
}

export const ordinaryIndex = async (req, res) => {
    try {
        const full = req.query.date;
        const full_last = lastDayOfMonth(parseISO(req.query.date));
        const result = await Transactions.findAll({
            where: {
                date: {[Op.between]: [full, FormatDate2(full_last)]}
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
            order: [
                ['date', 'ASC']
            ],
        });
        const months = await Transactions.findAll({
            attributes: [
                'id', 'date', 'category_id',
                // [Sequelize.fn('DISTINCT', Sequelize.col('category_id')) ,'beda']
            ]
        });
        res.status(200).json({result, months});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const sumIncome = async (req, res) => {
    let sum_income_monthly, sum_spending_monthly;
    if (req.query.date) {
        const full = req.query.date;
        const full_last = lastDayOfMonth(parseISO(full));

        sum_income_monthly = await Transactions.sum('nominal', {
            where: {category_id: 1, date: {[Op.between]: [full, FormatDate2(full_last)]}}
        });
        sum_spending_monthly = await Transactions.sum('nominal', {where: {category_id: 3, date: {[Op.between]: [full, FormatDate2(full_last)]}}});
    }
    

    const sum_income = await Transactions.sum('nominal', {where: {category_id: 1}});
    const sum_spending = await Transactions.sum('nominal', {where: {category_id: 3}});
    
    const report_inspenn = await Transactions.findAll({
        where: {
            category_id: 1
        }
    })
    
    const report_spending = await Transactions.findAll({
        where: {
            category_id: 3
        }
    });
    const app_setting = await Content.findOne({
        where: {
            slug: 'setting-app'
        }
    });
    let current_balance, sum_balance_monthly;
    if(!app_setting.saldo_awal || app_setting.saldo_awal == 0){
        sum_balance_monthly = sum_income_monthly - sum_spending_monthly;
        current_balance = sum_income - sum_spending;
    }else{
        sum_balance_monthly = (parseFloat(app_setting.saldo_awal) + sum_income_monthly) - sum_spending_monthly;
        current_balance = (parseFloat(app_setting.saldo_awal) + sum_income) - sum_spending;
    }
    res.json({sum_income, sum_spending, report_inspenn, report_spending, current_balance, sum_income_monthly, sum_spending_monthly, sum_balance_monthly});
}

export const monthlyReport = async (req, res) => {
    try {
        const full = req.params.date;
        const full_last = lastDayOfMonth(parseISO(req.params.date));
        const report_inspenn = await Transactions.findAll({
            where: {
                [Op.and] : [
                    {category_id: 1},
                    {date: {[Op.between]: [full, FormatDate2(full_last)]}}
                ]
            }
        })
        
        const report_spending = await Transactions.findAll({
            where: {
                [Op.and] : [
                    {category_id: 3},
                    {date: {[Op.between]: [full, FormatDate2(full_last)]}}
                ]
            }
        });
        res.status(200).json({report_inspenn, report_spending});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const store = async (req, res) => {
    const {category_id, title, nominal, date, note} = req.body;
    let evidence, url_evidence;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/transaction/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg', '.pdf'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format yang diizinkan: png, jpg, jpeg, pdf"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file sebesar 5MB"});
        file.mv(`./public/documents/transaction/${fileName}`);

        evidence = fileName;
        url_evidence = url;
    }else{
        evidence = null;
        url_evidence = null;
    }
    try {
        await Transactions.create({
            category_id,
            title,
            nominal,
            date,
            note,
            created_by: req.userId,
            updated_by: req.userId,
            evidence,
            url: url_evidence
        });
        res.status(201).json({msg: "Transaksi berhasil ditambahkan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const detail = async (req, res) => {
    try {
        const trx = await Transactions.findOne({
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
        if(!trx) return res.status(404).json({msg: "Data transaksi tidak ditemukan"});
        res.status(200).json(trx);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const update = async (req, res) => {
    const trx = await Transactions.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!trx) return res.status(404).json({msg: "Data transaksi tidak ditemukan"});
    const {category_id, title, nominal, date, note} = req.body;

    let evidence, url_evidence;
    if (req.files) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get('host')}/documents/transaction/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Format gambar yang diizinkan: png, jpg, jpeg"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Maksimal file gambar sebesar 5MB"});

        if (trx.evidence) {
            const filePath = `./public/documents/transaction/${trx.evidence}`;
            fs.unlinkSync(filePath);
        }
        
        file.mv(`./public/documents/transaction/${fileName}`, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });

        evidence = fileName;
        url_evidence = url;
    }else{
        evidence = trx.evidence;
        url_evidence = trx.url;
    }

    try {
        await Transactions.update({
            category_id,
            title,
            nominal,
            date,
            note,
            updated_by: req.userId,
            evidence,
            url: url_evidence
        },{
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Transaksi berhasil diperbaharui"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const destroy = async (req, res) => {
    const trx = await Transactions.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!trx) return res.status(404).json({msg: "Data transaksi tidak ditemukan"});
    try {
        if (trx.evidence) {
            const filePath = `./public/documents/transaction/${trx.evidence}`;
            fs.unlinkSync(filePath);   
        }
        await Transactions.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Transaksi berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}