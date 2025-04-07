import Table, { ColumnProps } from 'antd/es/table'
import React, { useRef } from 'react'
import { Bill, DishItem } from '../models/BillsModel'
import { useReactToPrint } from 'react-to-print'
import { Modal, Typography } from 'antd'
import { formatDate } from '../utils/formatDate'
import { VND } from '../utils/handleCurrency'
import handleAPI from '../api/handleAPI'
interface Props {
    visible: boolean
    onClose: () => void,
    bill?: Bill,
}

const BillPayment = (props: Props) => {
    const { visible, onClose, bill } = props

    const printRef = useRef<HTMLDivElement>(null)

    const columns: ColumnProps<DishItem>[] = [
        {
            key: 'name',
            dataIndex: 'title',
            title: 'Tên',
            width: 200
        },
        {
            key: 'price',
            dataIndex: 'price',
            title: 'Giá bán',
            width: 100
        },
        {
            key: 'qty',
            dataIndex: 'count',
            title: 'SL',
            width: 50
        },
        {
            key: 'totalPrice',
            dataIndex: '',
            title: 'Tổng giá',
            width: 100,
            render: (dishItems: DishItem) => dishItems.count * dishItems.price
        },
    ]
    const handlePrintBill = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Hóa đơn',
        pageStyle: `
                @media print {
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        font-weight: 500;
                        margin: 0;
                        padding: 0;
                    }
        
                    .table {
                        width: 100%;
                        font-size: 8px;
                        border-collapse: collapse;
                    }
                }
        
                `
    })

    const handleAddBill = async () => {
        const data: any = {
            ...bill,
            totalPrice: bill && bill.dishItem.length > 0 && bill.discount !== undefined ? 
            bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0) - (bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0) * bill.discount) / 100 :
            0
        }
        delete data.tableName
        try {
            const api = '/bill/add-new-bill'
            await handleAPI(api, data, 'post')
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        onClose()
    }
    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            onClose={handleClose}
            onOk={() => {
                handlePrintBill()
                handleAddBill()
            }}
            title='Bill'
            okText='Xuất bill'
            styles={{
                body: {
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  paddingRight: '8px',
                }
            }}
        >
            <div ref={printRef}>
                <div className='text-center mb-4'>
                    <Typography.Title level={3}>Nhà hàng Hải Dương</Typography.Title>
                    <p>Phố chợ, Tam Quan, Tam Đảo, Vĩnh Phúc</p>
                    <p>SĐT: 0395565218</p>
                </div>
                <div>
                    <Typography.Title level={3} className='text-center'>Biên lai thanh toán</Typography.Title>
                    <div className='mb-4'>
                        <p>Mã bàn: {bill?.tableId}</p>
                        <p>Tên bàn: {bill?.tableName}</p>
                        <p>Thời gian in:  {formatDate(new Date())}</p>
                    </div>
                    <Table columns={columns} dataSource={bill?.dishItem} bordered key={'title'} pagination={false} />
                    <div className='flex justify-between items-center mt-4'>
                        <Typography.Title level={5} style={{ margin: '0' }}>Tổng tiền: </Typography.Title>
                        <Typography.Title level={5} style={{ margin: '0' }}>{bill && bill.dishItem.length > 0 ? VND.format(bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0)) : 0}</Typography.Title>
                    </div>
                    <div className='flex justify-between items-center mt-3'>
                        <Typography.Title level={5} style={{ margin: '0' }}>Giảm giá: </Typography.Title>
                        <Typography.Title level={5} style={{ margin: '0' }}>{
                            bill && bill.dishItem.length > 0 && bill.discount !== undefined ? 
                            VND.format((bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0) * bill.discount) / 100) : 0
                        }</Typography.Title>
                    </div>
                    <div className='flex justify-between items-center mt-3'>
                        <Typography.Title level={4} style={{ margin: '0' }}>Thành tiền: </Typography.Title>
                        <Typography.Title level={4} style={{ margin: '0' }}>{
                            bill && bill.dishItem.length > 0 && bill.discount !==undefined? 
                            VND.format(bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0) - (bill.dishItem.reduce((a, b) => a + (b.count * b.price), 0) * bill.discount) / 100) : 0
                        }</Typography.Title>
                    </div>
                    <div className='text-center mt-4'>
                        <p>-------------------------------------</p>
                        <p>Cảm ơn quý khách và hẹn gặp lại !</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default BillPayment
