import { ORDER_STATUS } from '../enum'
import { Restaurants } from '../models/restaurant'
import { Transactions } from '../models/transaction'
import { ISelectedMenu } from '../type'
import { LineServices } from './line.services'
import { MessageGeneratorServices } from './messageGenerator.services'
import { OrderServices } from './order.services'

export class TransactionServices {
    static async getTransaction(transactionId: string) {
        try {
            let databasePayload = await Transactions.findByPk(transactionId)
            if (!databasePayload) return
            return databasePayload?.get()
        } catch (e) {
            throw new Error('cannot transaction id not found')
        }
    }
    static async isPaid(transactionId: string): Promise<boolean> {
        try {
            const transaction = await Transactions.findByPk(transactionId)
            return transaction.getDataValue('paid')
            // return SCBServices.isPaid(transactionId)
        } catch (e) {
            throw new Error('cannot get transaction id ' + transactionId)
        }
    }
    static async completeVerified(transactionId: string) {
        try {
            const transaction = await Transactions.findByPk(transactionId)
            await transaction.update({
                paid: true
            })
            const orderId: any = transaction?.get('orderId')
            const order = await OrderServices.update(
                orderId,
                'status',
                ORDER_STATUS.COOKING
            )

            const selectedMenu: Array<ISelectedMenu> = order.selectedMenu
            const restaurant = await Restaurants.findByPk(order.restaurantId)
            await LineServices.sendMessageRaw(
                transaction?.getDataValue('lineUid'),
                [MessageGeneratorServices.receipt(
                    transactionId,
                    selectedMenu,
                    restaurant?.getDataValue('name'),
                    restaurant?.getDataValue('address')
                ), {
                    type: 'text',
                    text: `order number ${order.id} is cooking your order.`
                }]
            )
            return transaction?.toJSON()
        } catch (e) {
            throw new Error(e)
        }
    }
}
