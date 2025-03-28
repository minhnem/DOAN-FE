import { Button, Card, Dropdown, MenuProps, message, Modal, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import iconTable from '../assets/image/icons8-table-100.png'
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDeleteForever, MdEditSquare } from 'react-icons/md';
import { BiSolidDetail } from "react-icons/bi";
import { AiFillNotification } from "react-icons/ai";
import ModalTable from '../modals/ModalTable';
import handleAPI from '../api/handleAPI';
import { TableModel } from '../models/TableModel';
import ModalTableDetail from '../modals/ModalTableDetail';

const {confirm} = Modal

const TableManagement = () => {

    const [tableSelected, setTableSelected] = useState<TableModel>();
    const [tableDetailSelected, setTableDetailSelected] = useState<TableModel>();
    const [isLoading, setIsLoading] = useState(false);
    const [tables, setTables] = useState<TableModel[]>([]);
    const [isVisibleModelTable, setIsVisibleModelTable] = useState(false);
    const [isVisibleModelTableDetail, setIsVisibleModelTableDetail] = useState(false);

    useEffect(() => {
        getAllTable()
    }, []);

    const getAllTable = async () => {
        try {
            setIsLoading(true)
            const api = '/table'
            const res: any = await handleAPI(api)
            res.data && setTables(res.data)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveTable = async (table: TableModel) => {
        try {
            setIsLoading(true)
            const api = `/table/delete-table?id=${table._id}`
            const res: any = await handleAPI(api, undefined, 'delete')
            res && message.success(res.message)
            getAllTable()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Card>
                <div className='flex justify-between items-center mb-4'>
                    <Typography.Title level={3}>Quản lý bàn ăn</Typography.Title>
                    <div>
                        <Button type='primary' onClick={() => setIsVisibleModelTable(true)}>Thêm mới</Button>
                    </div>
                </div>
                <div className='grid grid-cols-6 gap-5'>
                    {tables.map((table, index) => {
                        const items: MenuProps['items'] = [
                            {
                                key: 'updateTable',
                                label: 'Sửa bàn ăn',
                                icon: <MdEditSquare color='#3b82f6 ' size={20} />,
                                onClick: () => {
                                    setTableSelected(table)
                                    setIsVisibleModelTable(true)
                                }
                            },
                            {
                                key: 'detail',
                                label: 'Chi tiết',
                                icon: <BiSolidDetail color='gray' size={20} />,
                                onClick: () => {
                                    setTableDetailSelected(table)
                                    setIsVisibleModelTableDetail(true)
                                }
                            },
                            {
                                key: 'oder',
                                label: 'Gọi món',
                                icon: <AiFillNotification color='green' size={20} />
                            },
                            {
                                key: 'remove',
                                label: 'Xóa bàn',
                                icon: <MdDeleteForever color='#ef4444' size={20} />,
                                onClick: () => {
                                    confirm({
                                        title: 'Xác nhận',
                                        content: 'Bạn có chắc muốn xóa bàn ăn này không??',
                                        onOk: () => {
                                            handleRemoveTable(table)
                                        }
                                    })
                                }
                            },
                        ]
                        return <div key={index} className='flex justify-center flex-col border-[3px] border-[#ccccc] p-2 rounded-xl'>
                            <div className='flex justify-between w-full'>
                                <Typography.Title level={5} className='ml-3'>{table.name}</Typography.Title>
                                <Dropdown menu={{ items }} placement='bottomRight' className='cursor-pointer'>
                                    <Button type='link'>
                                        <HiDotsHorizontal size={32} />
                                    </Button>
                                </Dropdown>
                            </div>
                            <div className='flex justify-center'>
                                <img src={iconTable} alt='icon-table' width={90} />
                            </div>
                            <div className='text-center'>
                                <p>Trạng thái:</p>
                                <p>{table.status}</p>
                            </div>
                        </div>
                    })}

                </div>
            </Card>
            <ModalTable
                table={tableSelected}
                visible={isVisibleModelTable}
                onClose={() => {
                    setIsVisibleModelTable(false)
                    setTableSelected(undefined)
                }}
                onAddNew={(_val) => getAllTable()} 
            />

            <ModalTableDetail
                table={tableDetailSelected}
                visible={isVisibleModelTableDetail}
                onClose={() => {
                    setIsVisibleModelTableDetail(false)
                    setTableSelected(undefined)
                }}
                onAddNew={(val) => console.log(val)}
            />
        </div>
    )
}

export default TableManagement
