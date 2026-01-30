class InputFieldConfig extends Component {

    fetchOptions = (optionSet) => {    
        let output = []
        optionSet.options.map(items => {
            output.push({'value': items.code , 'label': items.displayName })
        })
        return output
    }

    conditionalHide = (condition, parentField, conditionValue, field) => {

        

        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }

    
    
    render() {
        let attribute = this.props.data
        let values = this.props.values 
        let form = this.props.form
        let rules = this.props.rules
        let options = []

        if(attribute.dataElement.optionSet) {
            
            options = this.fetchOptions(attribute.dataElement.optionSet)
            let field = <Field
                            name={attribute.dataElement.id}
                            label={attribute.dataElement.displayFormName}
                            type={attribute.dataElement.valueType}
                            component={SingleSelectFieldFF}
                            key={attribute.dataElement.id}
                            validate= {attribute.mandatory ? hasValue: false}
                            options={options}
                        />
            const returnStructure = <ValidatorComponent fieldId = {attribute.dataElement.id}  attribute={attribute}  values={values} form={form} rules={rules} field={field}/>

            return (returnStructure)
            
        } else {

            let field = <Field
                    name={attribute.dataElement.id}
                     label={attribute.dataElement.displayFormName}
                     type={attribute.dataElement.valueType}
                      component={InputFieldFF}
                     key={attribute.dataElement.id}
                     validate= {attribute.mandatory ? hasValue: false}
                    
                 />
            const returnStructure = <ValidatorComponent fieldId = {attribute.dataElement.id} attribute={attribute}  values={values} form={form} rules={rules} field={field}/>
            return (returnStructure)    
            
        }
    }
}

class DataFieldConfig extends Component {
    constructor(props){
        super(props);
        this.state = {
            'selectedDate': new Date(),
            'handleDateChange': new Date()
        }
    }
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data
        // const [selectedDate, handleDateChange] = React.useState(new Date());

        if(validate[attribute.dataElement.id]) {                
                const conditionalHide = this.conditionalHide(
                    validate[attribute.dataElement.id], 
                    validate[attribute.dataElement.id][0].field, 
                    validate[attribute.dataElement.id][0].value,
                    <DatePicker
                    label={attribute.dataElement.displayFormName} 
                    name={attribute.dataElement.id}
                    required={true}
                    dateFunsUtils={DateFnsUtils}
                    margin="normal"
                    variant="inline"
                    format="yyyy-MM-dd"
                />
                    )

                return (conditionalHide)
        } else {
            return (
                <DatePicker
                    label={attribute.dataElement.displayFormName} 
                    name={attribute.dataElement.id}
                    required={true}
                    dateFunsUtils={DateFnsUtils}
                    margin="normal"
                    variant="inline"
                    format="yyyy-MM-dd"
                />
            )
        }
        
    }
}

class TimeFieldConfig extends Component {
    constructor(props){
        super(props);
        this.state = {
            'selectedDate': new Date(),
            'handleDateChange': new Date()
        }
    }
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data
        // const [selectedDate, handleDateChange] = React.useState(new Date());
        if(validate[attribute.dataElement.id]) {                
            const conditionalHide = this.conditionalHide(
                validate[attribute.dataElement.id], 
                validate[attribute.dataElement.id][0].field, 
                validate[attribute.dataElement.id][0].value,
                <TimePicker
                label={attribute.dataElement.displayFormName} 
                name={attribute.dataElement.id}
                required={true}
                dateFunsUtils={DateFnsUtils}
                margin="normal"
                variant="inline"
                format="HH:MM"
            />
                )

            return (conditionalHide)
    } else {
        return (
            <TimePicker
                label={attribute.dataElement.displayFormName} 
                name={attribute.dataElement.id}
                required={true}
                dateFunsUtils={DateFnsUtils}
                margin="normal"
                variant="inline"
                format="HH:MM"
            />
        )
    }
    }
}

class AgeFieldConfig extends Component {
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data
        
        const required = value => (value ? undefined : 'Required')
        const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined)
        const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
        const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

        if(validate[attribute.dataElement.id]) {                
            const conditionalHide = this.conditionalHide(
                validate[attribute.dataElement.id], 
                validate[attribute.dataElement.id][0].field, 
                validate[attribute.dataElement.id][0].value,
                <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type="number"
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {composeValidators(required, mustBeNumber)}
            />
                )

            return (conditionalHide)
    } else {
        return (
            <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type="number"
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {composeValidators(required, mustBeNumber)}
            />
        )
    }
        

    }
}

class OUFieldConfig extends Component {
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data
        

        if(validate[attribute.dataElement.id]) {                
            const conditionalHide = this.conditionalHide(
                validate[attribute.dataElement.id], 
                validate[attribute.dataElement.id][0].field, 
                validate[attribute.dataElement.id][0].value,
                <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={attribute.dataElement.valueType}
                component={SingleSelectFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {attribute.mandatory ? hasValue: false}
                options = {[]}
            />
                )

            return (conditionalHide)
    } else {
        return (
            <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={attribute.dataElement.valueType}
                component={SingleSelectFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {attribute.mandatory ? hasValue: false}
                options = {[]}
            />
        )
    }
    }
}

class PhoneNumberFieldConfig extends Component {
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data
        const numberFormat = value =>
        isNaN(value) && value? `Incorrect format` : undefined 

        if(validate[attribute.dataElement.id]) {                
            const conditionalHide = this.conditionalHide(
                validate[attribute.dataElement.id], 
                validate[attribute.dataElement.id][0].field, 
                validate[attribute.dataElement.id][0].value,
                <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={'number'}
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {numberFormat}
            />
                )

            return (conditionalHide)
    } else {
        return (
            <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={'number'}
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {numberFormat}
            />
        )
    }
    }
}

class EmailFieldConfig extends Component {
    conditionalHide = (condition, parentField, conditionValue, field) => {
        const final = this.props.values[parentField] == conditionValue &&
        field

        return final
    }
    render() {
        let attribute = this.props.data

        // const required = value => (value ? undefined : 'Required')
        // const emailFormat = value => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value) ? undefined : value ? "Inccorect email format" : undefined
        // const minValue = min => value =>
        // isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
        // const composeValidators = (...validators) => value =>
        // validators.reduce((error, validator) => error || validator(value), undefined)

        const EMAIL_ADDRESS_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

        const invalidEmailMessage = 'Please provide a valid email address'

        const email = value =>
            isEmpty(value) || (isString(value) && EMAIL_ADDRESS_PATTERN.test(value))
                ? undefined
                : invalidEmailMessage

                if(validate[attribute.dataElement.id]) {                
                    const conditionalHide = this.conditionalHide(
                        validate[attribute.dataElement.id], 
                        validate[attribute.dataElement.id][0].field, 
                        validate[attribute.dataElement.id][0].value,
                        <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={'email'}
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {email}
                
            />
                        )
        
                    return (conditionalHide)
            } else {
                return (
                    <Field
                name={attribute.dataElement.id}
                label={attribute.dataElement.displayFormName}
                type={'email'}
                component={InputFieldFF}
                key={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                validate= {email}
                
            />
                )
            }
    }
}

class BooleanFieldConfig extends Component {
    conditionalHide = (condition, parentField, conditionValue, field) => {
      
        // const final = this.props.values[parentField] == conditionValue 
        // &&
        // field
        let a = null
        let b = null
        const final1 = condition.map(item => {
            if(item.operator) {
                
                b += this.props.values[item.field] == item.value
            } else {
                
                 a += this.props.values[item.field] == item.value
            }
            
            return a
        })

        
        let  returnOutput = null 
        if(b != null) {
            returnOutput = a==1 && b==1 && field
        } else {
            returnOutput = a==1 && field
        } 
        
        return returnOutput
    }
    render() {
    
        let attribute = this.props.data
        
        const switchData = [
            {label: 'Yes', value: 'item1'},
        ];
        
        if(validate[attribute.dataElement.id]) {   
                       
            const conditionalHide = this.conditionalHide(
                validate[attribute.dataElement.id], 
                validate[attribute.dataElement.id][0].field, 
                validate[attribute.dataElement.id][0].value,
                <Switches
                label={attribute.dataElement.displayFormName}
                name={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                data={switchData}
            />
                )

                return (
                    <Switches
                        label={attribute.dataElement.displayFormName}
                        name={attribute.dataElement.id}
                        required = {attribute.mandatory ? true: false}
                        data={switchData}
                    />
                )
    } else {
        return (
            <Switches
                label={attribute.dataElement.displayFormName}
                name={attribute.dataElement.id}
                required = {attribute.mandatory ? true: false}
                data={switchData}
            />
        )
    }
    }
}

class DefaultValue extends Component {
    constructor(props){
        super(props);
        this.state = {
            defaultValue: ''
        }
    }
    componentDidMount() {
        const attribute = this.props.data
        apiServices.generateUIC(attribute.dataElement.id)
            .then(res => {
                this.setState({
                    defaultValue : res.value
                })
        })
    }
    render() {
        const attribute = this.props.data
        return this.state.defaultValue ? (
            <Field
                    name={attribute.dataElement.id}
                    label={attribute.dataElement.displayFormName}
                    type={attribute.dataElement.valueType}
                    component={InputFieldFF}
                    key={attribute.dataElement.id}
                    validate= {attribute.mandatory ? hasValue: false}
                    defaultValue={this.state.defaultValue}
                    readOnly
                />
        ) : <Field
        name={attribute.dataElement.id}
        label={attribute.dataElement.displayFormName}
        type={attribute.dataElement.valueType}
        component={InputFieldFF}
        key={attribute.dataElement.id}
        validate= {attribute.mandatory ? hasValue: false}
    />
    }
}