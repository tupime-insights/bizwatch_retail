import React, {Component} from 'react';
import {
    Grid,Row,Col,Button, Alert, 
    FormGroup,FormControl,ControlLabel
      } from 'react-bootstrap';

import {inject} from 'mobx-react'; //no need for this .. just pass it as props
import {o_addStock} from 'services/offline_db/incomingStock'
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Cleave from 'cleave.js/react';

@inject('productStore', 'authStore')
class newStock extends Component{
   constructor(props){
      super(props)
      this.state = {
         productId: '',
         productQty:2,
         arrivalDate: new Date(),
         costPrice: '',
         batchCode: '',
         selectedCurrency: 'UGX',
         batchInputView:false,
         //alertBox
        alertShow:false,
        alertText:'',
        alertStatus: 'success' 
      }
   }
   handleProductId(e){
      //here u need to toggle batchInputView basing on this value.
       const {value} = e.target;
       const products = this.props.productArray

        let batchEnabled = products.find(k=>k.id === value && k.batchEnabled === true)
        if (batchEnabled){
             this.setState({productId:value, batchInputView: true})
        } else {
            //disable batchView.
            this.setState({productId:value,batchInputView: false})
        }
    
   }
   handleProductQty(e){
     this.setState({productQty: e.target.value})
   }
   handleArrivalDate(e){
     this.setState({arrivalDate: e.target.value})
   }
   
   handleBatchCode(e){
     this.setState({batchCode: e.target.value})
   }
   
   
   handleCostPrice(e){
         // formatted pretty value
        //console.log('currency mask',e.target.value);

        // raw value
        //console.log('actual value', e.target.rawValue);
        this.setState({costPrice:e.target.rawValue}) //$500000
   }
   
   handleNewStock(e){
     e.preventDefault();
     const currentEmployee = this.props.authStore.currentEmployee
     
     let newStock = {
       productId: this.state.productId,
       qty: this.state.productQty,
       costPrice: this.state.costPrice,
       arrivalDate: this.state.arrivalDate,
       actor: currentEmployee.username,
       shopId: currentEmployee.biz_code,
       batchCode: this.state.batchCode
     }

     if (newStock.productId === '') {
      this.showAlertBox('danger', 'Please  the product Name is not selected')
      return;
     }

      o_addStock(newStock)
         .then((result)=>{
            this.props.productStore._addNewStock(result)
            this.props.productStore.updateStockLevel(newStock.productId,result.sales_qty)
            this.showAlertBox('success', 'New stock added successful')
         })
         .catch(err=>{
            if (err) {
               this.showAlertBox('danger', 'Failed to add the new stock' )
            }
         })
   }

   showAlertBox(status,text){
      this.setState({
        alertShow:true,
        alertStatus: status, 
        alertText: text
      })
   }
  
   handleAlertDismiss(){
     this.setState({alertShow:false})
   }

   
   
   ////////////////
   render(){
      const productOptions = this.props.productArray;
      const batchOptions = this.props.batchCodeArray;

     return(
       <Row>
         <Col xs = {12}>
            { this.state.alertShow?
             <Alert bsStyle={this.state.alertStatus} closeLabel onDismiss= {this.handleAlertDismiss}>
                  <strong>{ this.state.alertText}</strong>
             </Alert> 
             :
             null
           }
             <form onSubmit = {this.handleNewStock.bind(this)}>
                 <FormGroup controlId="formControlsSelect">
                   <ControlLabel>Product Name</ControlLabel>
                   <FormControl
                     componentClass="select"
                     required
                     bsClass="form-control"
                     onChange =  {this.handleProductId.bind(this)}>
                      <option value = "">{'select the product Name'}</option>
                      {productOptions.map((item,i)=>{
                         return(
                           <option 
                              key = {i}
                              label= {item.name}
                              value = {item.id}
                              >
                              {item.name}
                            </option>
                         )
                      })}
                   </FormControl>
                 </FormGroup>
                 <FormInputs
                    ncols={["col-md-6","col-md-6"]}
                    proprieties={[
                           {
                             label: "Product Quantity",
                             type: "number",
                             bsClass: "form-control",
                             placeholder: "Enter sale Quantity",
                             defaultValue: this.state.productQty,
                             onChange: this.handleProductQty.bind(this),
                             required: true
                          },
                          {
                            label: "Arrival Date",
                            type: "date",
                            bsClass: "form-control",
                            defaultValue: this.state.arrivalDate,
                            onChange: this.handleArrivalDate.bind(this),
                            required: true
                         }
                       ]}
                    />
                 <Row>
                   <Col  xs = {6}>
                    <label>Cost Price</label>
                     <Cleave
                      placeholder = "Enter the cost price"
                      value = {this.state.costPrice}
                      className = "form-control"
                      options = {{
                               numeral: true,
                               numeralPositiveOnly: true,
                               //prefix: this.state.selectedCurrency,
                               //signBeforePrefix: true,
                               numeralThousandsGroupStyle: 'thousand'
                              }}
                          onChange = {this.handleCostPrice.bind(this)}
                        />
                     </Col>
                      <Col xs = {6}>
                          {
                             this.state.batchInputView ?
                               <FormGroup controlId="formControlsSelect">
                                   <ControlLabel>Batch Code</ControlLabel>
                                   <FormControl
                                      componentClass="select" required
                                      bsClass="form-control"
                                      onChange =  {this.handleBatchCode.bind(this)}>
                                    <option value = "" disabled>{'select the batch code'}</option>
                                      {batchOptions.map((item,i)=>{
                                       return(
                                          <option 
                                             key = {i}
                                             label= {item.batchName}
                                             value = {item.batchCode}
                                          >
                                       {item.batchName}
                                    </option>
                                   )
                                })}
                              </FormControl>
                           </FormGroup>
                               :
                              null
                          }
                          
                      </Col>
                   </Row>
                   <br></br>
                 <Button bsStyle="info"  type="submit">
                    {'Add New Stock'}
                 </Button>
             </form>
         </Col>
       </Row>
     )
   }
}

export default newStock