import{a as c}from"./axios-L6U4YIEh.js";import{_ as i,c as _,a as u,b as t,w as n,d as e,F as l,r,o as m}from"./index-Zc3DlZLd.js";var p={VITE_URL:"https://vue3-course-api.hexschool.io",VITE_PATH:"vuejs",BASE_URL:"/undefined/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const{VITE_URL:h}=p,f={methods:{checkAdmin(){const o=`${h}/v2/api/user/check`;c.post(o).then(a=>{console.log("驗證成功",a.data.success)}).catch(()=>{this.$router.push("/login")})}},mounted(){const o=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1");c.defaults.headers.common.Authorization=o,this.checkAdmin()}},k=u("h2",null,"這是後台",-1);function v(o,a,$,x,V,E){const s=r("RouterLink"),d=r("router-view");return m(),_(l,null,[k,u("nav",null,[t(s,{to:"/admin/products"},{default:n(()=>[e("產品列表")]),_:1}),e(" | "),t(s,{to:"/admin/order"},{default:n(()=>[e("訂單列表")]),_:1}),e(" | "),t(s,{to:"/"},{default:n(()=>[e("回到前台")]),_:1}),t(d)])],64)}const w=i(f,[["render",v]]);export{w as default};
