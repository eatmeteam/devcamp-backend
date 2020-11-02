export enum PAYMENT_METHOD {
    OMISE = 'OMISE',
    SCB_EASY = 'SCB',
}

export enum ORDER_STATUS {
    CREATED = 'Created',
    WAIT_FOR_PAYMENT = 'WAIT_FOR_PAYMENT',
    COOKING = 'COOKING',
    WAIT_FOR_PICKUP = 'WAIT_FOR_PAYMENT',
    COMPLETE = 'COMPLETE'
}