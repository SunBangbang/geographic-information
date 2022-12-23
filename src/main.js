/*
 * @Description:
 * @version:
 * @Author: Chen JianXin
 * @Date: 2020-12-02 16:11:52
 * @LastEditors: Chen JianXin
 * @LastEditTime: 2020-12-30 17:49:38
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './router/permission'
import moment from 'moment' // 时间处理插件
import VueCookies from 'vue-cookies' // cookies操作
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // 样式初始化
import '../public/iconfont/iconfont.css'
import '@/assets/css/common.scss'
import '@/assets/css/index.scss'
import './views/query/odMap/china'

import { formatbytes } from '@/assets/js/filters'
// import Print from 'vue-print-nb' // 页面打印

import {
  // element-ui 按需加载
  Button,
  ButtonGroup,
  Input,
  Select,
  Option,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Form,
  FormItem,
  Tag,
  Message,
  Backtop,
  Tabs,
  TabPane,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Icon,
  Table,
  TableColumn,
  Tooltip,
  RadioGroup,
  Cascader,
  Checkbox,
  Pagination,
  Dialog,
  Avatar,
  collapse,
  CollapseItem,
  descriptions,
  DescriptionsItem,
  Col,
  Row,
  Popover,
  Progress,
  MessageBox,
  TimeSelect,
  TimePicker,
  Timeline,
  TimelineItem,
  Switch,
  ColorPicker,
  Scrollbar,
  Card,
  Radio,
  Tree,
  Loading,
  Upload,
  CheckboxGroup,
  Link,
  Transfer,
  autocomplete,
  Container,
  Aside,
  Main
} from 'element-ui'

Vue.component(Button.name, Button)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Container.name, Container)
Vue.component(TimePicker.name, TimePicker)
Vue.component(TimeSelect.name, TimeSelect)
Vue.component(TimelineItem.name, TimelineItem)
Vue.component(Timeline.name, Timeline)
Vue.component(Link.name, Link)
Vue.component(Upload.name, Upload)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Tag.name, Tag)
Vue.component(Message.name, Message)
Vue.component(Backtop.name, Backtop)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Icon.name, Icon)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Cascader.name, Cascader)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Pagination.name, Pagination)
Vue.component(Dialog.name, Dialog)
Vue.component(Avatar.name, Avatar)
Vue.component(collapse.name, collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(Col.name, Col)
Vue.component(Row.name, Row)
Vue.component(Popover.name, Popover)
Vue.component(Progress.name, Progress)
Vue.component(MessageBox.name, MessageBox)
Vue.component(Scrollbar.name, Scrollbar)
Vue.component(Switch.name, Switch)
Vue.component(ColorPicker.name, ColorPicker)
Vue.component(Card.name, Card)
Vue.component(Transfer.name, Transfer)
Vue.component(descriptions.name, descriptions)
Vue.component(DescriptionsItem.name, DescriptionsItem)
Vue.component(autocomplete.name, autocomplete)
Vue.component(Tree.name, Tree)

Vue.use(Loading.directive)
// Vue.use(Print)
Vue.use(VueCookies)

Vue.prototype.$moment = moment
Vue.prototype.$message = Message
// Vue.prototype.$echarts = echarts
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false

/**
 * 存储单位换算
 * @param {*} bytes
 */
Vue.filter('formatbytes', formatbytes)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
