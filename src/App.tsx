import React, {useCallback, useMemo, useState} from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import DesignPanel from "./controls/DesignPanel";

import {
    UserOutlined,
    FileOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import CreateStructPage from "./pages/CreateStructPage";
import CreateMethodPage from "./pages/CreateMethodPage";
import CreateServicePage from "./pages/CreateServicePage";
import ServicesPage from "./pages/ServicesPage";
import {MethodStub, StringType, StructType, Type} from "./model/MethodStub";
import {Service} from "./model/Service";
import { StructsContext } from './contexts/StructsContext';
import { MethodsContext } from './contexts/MethodsContext';
import { ServicesContext } from './contexts/ServicesContext';
import UpdateServicePage from "./pages/UpdateServicePage";
import {parse} from "./utils/IdlParser";
import demoFiles from "./utils/demoFiles";
import {EditPanel} from "./controls/ServiceDependencyDesignPanel";
import {InfrastructuresContext} from "./contexts/InfrastructuresContext";
import {Infrastructure} from "./model/Infrastructure";
import InfrastructuresPage from "./pages/InfrastructuresPage";
import CreateInfrastructurePage from "./pages/CreateInfrastructurePage";
import UpdateInfrastructurePage from "./pages/UpdateInfrastructurePage";
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const initialInfrastructures: Infrastructure[] = [
    new Infrastructure('database', "account_db", [], []),
    new Infrastructure('database', "common_db", [], []),
    new Infrastructure('messageQueue', 'mq_account', [], []),
    new Infrastructure('redis', "r_account", [], [])
]



function App() {
    const parseResult = parse(demoFiles)

    const [collapsed, setCollapsed] = useState(false)

    const onCollapse = (collapsed: boolean) => {
        console.log(collapsed);
        setCollapsed(collapsed)
    };

    const [structs, setStructs] = useState<StructType[]>(parseResult.structs)
    const [methods, setMethods] = useState<MethodStub[]>(parseResult.methods)
    const [services, setServices] = useState<Service[]>(parseResult.services)
    const [infrastructures, setInfrastructures] = useState<Infrastructure[]>(initialInfrastructures)

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <SubMenu key="sub1" icon={<UserOutlined />} title="Project">
                            <Menu.Item key="3"><Link to={"/create/project"}>new project</Link></Menu.Item>
                            <Menu.Item key="4"><Link to={"/create/project"}>projects</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined />} title="Nodes">
                            <Menu.Item key="6">service</Menu.Item>
                            <Menu.Item key="7">infrastructure</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<FileOutlined />} title={"Services"}>
                            <Menu.Item key="10"><Link to={"/services"}>my services</Link></Menu.Item>
                            <Menu.Item key="11"><Link to={"/create/service"}>new service</Link></Menu.Item>
                            <Menu.Item key="12"><Link to={"/create/method"}>new method</Link></Menu.Item>
                            <Menu.Item key="13"><Link to={"/create/struct"}>new struct</Link></Menu.Item>
                            <Menu.Item key="14">from idl</Menu.Item>
                            <Menu.Item key="15"><Link to={"/design/dependencies"}>design</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<FileOutlined />} title={"Infrastructures"}>
                            <Menu.Item key="16"><Link to={"/infrastructures"}>my infrastructures</Link></Menu.Item>
                            <Menu.Item key="17"><Link to={"/create/infrastructure"}>new infrastructure</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <InfrastructuresContext.Provider value={{infrastructures: infrastructures, setInfrastructures: setInfrastructures}}>
                            <StructsContext.Provider value={{structs: structs, setStructs: setStructs}}>
                                <MethodsContext.Provider value={{methods: methods, setMethods: setMethods}}>
                                    <ServicesContext.Provider value={{services: services, setServices: setServices}}>
                                        <div className="site-layout-background" style={{ padding: 24, minHeight: 1000 }}>
                                            <Routes>
                                                <Route path={"/create/project"} element={<DesignPanel/>}/>
                                                <Route path={"/create/struct"} element={<CreateStructPage/>}/>
                                                <Route path={"/create/method"} element={<CreateMethodPage/>}/>
                                                <Route path={"/create/service"} element={<CreateServicePage/>}/>
                                                <Route path={"/services"} element={<ServicesPage/>}/>
                                                <Route path={"/update/service/:name/:version"} element={<UpdateServicePage/>}/>
                                                <Route path={"/design/dependencies"} element={<EditPanel/>}/>
                                                <Route path={"/infrastructures"} element={<InfrastructuresPage/>}/>
                                                <Route path={"/create/infrastructure"} element={<CreateInfrastructurePage/>}/>
                                                <Route path={"/update/infrastructure/:name"} element={<UpdateInfrastructurePage/>}/>
                                            </Routes>
                                        </div>
                                    </ServicesContext.Provider>
                                </MethodsContext.Provider>
                            </StructsContext.Provider>
                        </InfrastructuresContext.Provider>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
