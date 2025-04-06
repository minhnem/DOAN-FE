import { Modal, Typography } from 'antd'
import Table, { ColumnProps } from 'antd/es/table'
import React, { useRef } from 'react'
import { formatDate } from '../utils/formatDate'
import { BillKetchen, DishItem } from '../models/BillsModel'
import { useReactToPrint } from 'react-to-print'


interface Props {
    visible: boolean
    onClose: () => void,
    bill?: BillKetchen,
}

const BillModal = (props: Props) => {
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
            }}
            title='Bill'
            okText='Xuất bill'
        >
            <div ref={printRef}>
                <Typography.Title level={3} className='text-center'>Thông tin</Typography.Title>
                <div className='mb-4'>
                    <p>Mã bàn: {bill?.tableId}</p>
                    <p>Tên bàn: {bill?.tableName}</p>
                    <p>Thời gian:  {formatDate(new Date())}</p>
                </div>
                <Table columns={columns} dataSource={bill?.dishItem} bordered key={'title'} pagination={false} />
            </div>
        </Modal>
    )
}

export default BillModal
