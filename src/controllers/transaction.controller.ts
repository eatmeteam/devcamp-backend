import { NextFunction, Request, Response } from 'express'
import { PAYMENT_METHOD } from '../enum'
import { Transactions } from '../models/transaction'
import { SCBServices } from '../services/scb.services'
import { TransactionServices } from '../services/transaction.services'

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { payAmount, orderId, bypass } = req.body
            const response = await SCBServices.createLink(payAmount)
            await Transactions.create({
                id: response!.transactionId,
                amount: payAmount,
                lineUid: req.user.userId,
                orderId: orderId,
                paid: bypass
            })
            res.json({
                transactionId: response!.transactionId,
                deeplinkUrl: response!.deeplinkUrl,
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.body
            res.json(await TransactionServices.getTransaction(transactionId))
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await Transactions.findAll())
        } catch (e) {
            next(e)
        }
    }
    static async isPaid(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.body
            const isPaid = await TransactionServices.isPaid(transactionId)
            res.json({ paid: isPaid })
        } catch (e) {
            next(e)
        }
    }
}
