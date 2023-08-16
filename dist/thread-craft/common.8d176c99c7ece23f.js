"use strict";(self.webpackChunkthread_craft=self.webpackChunkthread_craft||[]).push([[592],{2662:(_,m,r)=>{r.d(m,{_:()=>p});var t=r(2352),e=r(95),l=r(6218),d=r(3714),n=r(4946);let p=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=n.oAB({type:s}),s.\u0275inj=n.cJS({imports:[e.u5,e.UX,t.kW,l.A,d.j]}),s})()},7949:(_,m,r)=>{r.d(m,{V:()=>u});var t=r(4946),e=r(95),l=r(7513),d=r(2352),n=r(6218),p=r(3714),s=function(a){return a.COMPANY="company",a.CLIENT="client",a.VENDOR="vendor",a}(s||{});let u=(()=>{class a{set clearForm(i){i||(this.form.reset(),this.citiesOptions=[])}constructor(i){this.stateCityService=i,this.select="Select",this.required="required",this.statesOptions=[],this.citiesOptions=[],this.selectedState="",this.selectedCity="",this.formRequiredFields={companyName:"",email:"",contact:"",gst:"",address:"required",state:"required",city:"required",pinCode:"required"},this.formData=new t.vpe,this.form=new e.cw({companyName:new e.NI(""),email:new e.NI(""),contact:new e.NI(""),gst:new e.NI(""),address:new e.NI("",[e.kI.required]),state:new e.NI("",[e.kI.required]),city:new e.NI("",[e.kI.required]),pinCode:new e.NI("",[e.kI.required])}),this.onFormControlValueChanges()}ngOnInit(){let i=this.stateCityService.getStatesByCountry("IN");this.statesOptions=i.filter(o=>!["Kenmore","Narora","Natwar","Paschim Medinipur","Vaishali"].includes(o)),this.statesOptions.unshift(this.select),this.emitFormData()}onFormControlValueChanges(){this.form.valueChanges.subscribe(()=>{this.emitFormData()})}ngOnChanges(i){let o=this.form.controls;this.wrapperComponentName===s.COMPANY?(this.formRequiredFields.companyName=this.required,o.companyName.addValidators(e.kI.required)):this.wrapperComponentName===s.CLIENT?(this.formRequiredFields.contact=this.required,o.contact.addValidators(e.kI.required)):this.wrapperComponentName===s.VENDOR&&(this.formRequiredFields.companyName=this.required,this.formRequiredFields.contact=this.required,o.companyName.addValidators(e.kI.required),o.contact.addValidators(e.kI.required)),i.updateFormData?.currentValue&&this.setupFormData()}emitFormData(){this.formData.emit("VALID"===this.form.status?{data:this.form.getRawValue(),status:!0}:{data:this.form.getRawValue(),status:!1})}selectState(i){this.selectedState="",i.value!==this.select?(this.selectedState=i.value,this.citiesOptions=this.stateCityService.getCitiesByState("IN",this.selectedState)):this.citiesOptions=[],this.emitFormData()}setupFormData(){let i=this.form.controls;this.citiesOptions=this.stateCityService.getCitiesByState("IN",this.updateFormData.state),Object.keys(this.form.controls).forEach(o=>{i[o].setValue(this.updateFormData[o])}),this.emitFormData()}}return a.\u0275fac=function(i){return new(i||a)(t.Y36(l.Z))},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-common-form"]],inputs:{wrapperComponentName:"wrapperComponentName",clearForm:"clearForm",updateFormData:"updateFormData"},outputs:{formData:"formData"},features:[t.TTD],decls:35,vars:31,consts:[[1,"col-12"],[3,"formGroup"],[1,"p-fluid","p-formgrid","grid"],["htmlFor","companyName"],["pInputText","","id","companyName","type","text","formControlName","companyName"],[1,"col-12","md:col-6"],["htmlFor","email"],["pInputText","","id","email","type","text","formControlName","email"],["htmlFor","contact"],["pInputText","","id","contact","type","text","formControlName","contact"],["htmlFor","gst"],["pInputText","","id","gst","type","text","formControlName","gst"],["htmlFor","address"],["pInputTextarea","","id","address","rows","4","formControlName","address"],["htmlFor","state"],["formControlName","state",3,"options","filter","onChange"],["htmlFor","city"],["formControlName","city",3,"options","ngModel","filter","disabled","ngModelChange"],["htmlFor","zip"],["pInputText","","id","zip","type","text","formControlName","pinCode"]],template:function(i,o){1&i&&(t.TgZ(0,"div",0)(1,"form",1)(2,"div",2)(3,"div",0)(4,"label",3),t._uU(5,"Company Name"),t.qZA(),t._UZ(6,"input",4),t.qZA(),t.TgZ(7,"div",5)(8,"label",6),t._uU(9,"Email"),t.qZA(),t._UZ(10,"input",7),t.qZA(),t.TgZ(11,"div",5)(12,"label",8),t._uU(13,"Contact"),t.qZA(),t._UZ(14,"input",9),t.qZA(),t.TgZ(15,"div",0)(16,"label",10),t._uU(17,"GST"),t.qZA(),t._UZ(18,"input",11),t.qZA(),t.TgZ(19,"div",0)(20,"label",12),t._uU(21,"Address"),t.qZA(),t._UZ(22,"input",13),t.qZA(),t.TgZ(23,"div",5)(24,"label",14),t._uU(25,"State"),t.qZA(),t.TgZ(26,"p-dropdown",15),t.NdJ("onChange",function(c){return o.selectState(c)}),t.qZA()(),t.TgZ(27,"div",5)(28,"label",16),t._uU(29,"City"),t.qZA(),t.TgZ(30,"p-dropdown",17),t.NdJ("ngModelChange",function(c){return o.selectedCity=c}),t.qZA()(),t.TgZ(31,"div",5)(32,"label",18),t._uU(33,"Pincode"),t.qZA(),t._UZ(34,"input",19),t.qZA()()()()),2&i&&(t.xp6(1),t.Q6J("formGroup",o.form),t.xp6(3),t.Tol(o.formRequiredFields.companyName),t.xp6(4),t.Tol(o.formRequiredFields.email),t.xp6(4),t.Tol(o.formRequiredFields.contact),t.xp6(4),t.Tol(o.formRequiredFields.gst),t.xp6(4),t.Tol(o.formRequiredFields.address),t.xp6(4),t.Tol(o.formRequiredFields.state),t.xp6(2),t.Q6J("options",o.statesOptions)("filter",!0),t.xp6(2),t.Tol(o.formRequiredFields.city),t.xp6(2),t.Q6J("options",o.citiesOptions)("ngModel",o.selectedCity)("filter",!0)("disabled",!(null!=o.citiesOptions&&o.citiesOptions.length)),t.xp6(2),t.Tol(o.formRequiredFields.pinCode))},dependencies:[e._Y,e.Fj,e.JJ,e.JL,e.sg,e.u,d.Lt,n.g,p.o]}),a})()}}]);