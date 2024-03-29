import { NextFunction, Request, Response } from 'express'
import { Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import { Menus } from '../models/menu'
import { Restaurants } from '../models/restaurant'
import { MenuServices } from '../services/menu.services'

export class MenuController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, price, img, restaurantId } = req.body
            if (uuidValidate(restaurantId)) {
                const response = await MenuServices.create(
                    name,
                    price,
                    img,
                    restaurantId
                )
                res.json(response)
            }
            throw new Error('restaurant is not uuid')
        } catch (e) {
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { menuId } = req.body
            const response = await Menus.findByPk(menuId)
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.body
            const response = await Menus.findAll({
                where: { restaurantId: restaurantId },
                raw: true,
            })
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, restaurantId } = req.body
            const menu = await Menus.findAll({
                where: {
                    name: {
                        [Op.substring]: name,
                    },
                    restaurantId: restaurantId,
                },
            })
            res.json(menu)
        } catch (e) {
            next(e)
        }
    }

    static async random(req: Request, res: Response, next: NextFunction){
        try{
            const menu = await Menus.findAll({
                include: Restaurants
            })
            if(!menu) res.status(400) 
            const selected = menu[Math.floor(Math.random() * menu.length)]
            res.json(selected)
        } catch (e){
            next(e)
        }
    }
}
