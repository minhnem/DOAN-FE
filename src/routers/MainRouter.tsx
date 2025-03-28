import { Affix, Layout } from 'antd'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiderComponent from '../components/SiderComponent'
import HeaderComponent from '../components/HeaderComponent'
import HomeScreen from '../screens/HomeScreen'
import Dashboard from '../screens/Dashboard'
import Category from '../screens/Category'
import AddDish from '../screens/MenuManagement/AddDish'
import MenuManagement from '../screens/MenuManagement/MenuManagement'
import Suppliers from '../screens/Suppliers'
import PromotionScreen from '../screens/PromotionScreen'
import InventoryManagement from '../screens/InventoryManagement/InventoryManagement'
import AddMenterials from '../screens/InventoryManagement/AddMaterials'
import CategoryMenterials from '../screens/InventoryManagement/CategoryMaterials'
import TableManagement from '../screens/TableManagement'

const {Content, Footer} = Layout

const MainRouter = () => {
  return (
    <BrowserRouter>
       <Layout>
        <Affix offsetTop={0}>
          <SiderComponent/>
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className='mx-auto p-6 container'>
            <Routes>
              <Route path='/' element={<HomeScreen />}/>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/category' element={<Category />}/>
              <Route>
                <Route path='/menu' element={<MenuManagement />}/>
                <Route path='/menu/add-new-dish' element={<AddDish />}/>
              </Route>
              <Route path='/supplier' element={<Suppliers/>}/>
              <Route path='/promotion' element={<PromotionScreen/>}/>
              <Route>
                <Route path='/inventory' element={<InventoryManagement/>}/>
                <Route path='/inventory/add-new-materials' element={<AddMenterials/>}/>
                <Route path='/inventory/category-materials' element={<CategoryMenterials/>}/>
              </Route>
              <Route path='/table-management' element={<TableManagement/>}/>
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default MainRouter
