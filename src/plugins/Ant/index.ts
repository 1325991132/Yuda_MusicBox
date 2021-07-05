import { Button, Input, Steps, Form, FormItem, Select, Alert, Row, Radio, DatePicker, Col, Checkbox, Switch, AutoComplete } from 'ant-design-vue'

const Antd = {
    install(Vue: any) {
        Vue.component(Button.name, Button)
        Vue.component(Input.name, Input)
        Vue.component(Steps.name, Steps)
        Vue.component(Form.name, Form)
        Vue.component(FormItem.name, FormItem)
        Vue.component(Alert.name, Alert)
        Vue.component(Select.name, Select)
        Vue.component(Row.name, Row)
        Vue.component(Radio.name, Radio)
        Vue.component(DatePicker.name, DatePicker)
        Vue.component(Col.name, Col)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(Switch.name, Switch)
        Vue.component(AutoComplete.name, AutoComplete)
    }
}
export default Antd
