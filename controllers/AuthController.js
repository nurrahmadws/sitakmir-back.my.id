import Users from "../models/User.js";
import argon2d from "argon2";

export const login = async (req, res) => {
    const user  = await Users.findOne({
        where: {
            username: req.body.uen
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
    const match = await argon2d.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Password salah!"});
    req.session.userId = user.id;
    const id = user.id;
    const name = user.name;
    const username = user.username;
    const email = user.email;
    const no_hp = user.no_hp;
    const role = user.role;
    const status = user.status;
    res.status(200).json({id, name, username, email, no_hp, role, status});
}

export const my_profile = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({msg: "Silahkan login terlebih dahulu!"});
    }
    const user = await Users.findOne({
        where: {
            id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
    res.status(200).json(user);
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"});
    })
}