var app = new Vue({
    el: '#app',
    data: {
        page_content: '<login v-bind:value="yolo"><login>'
    }
});

Vue.component('instruction_box', {
props: ['instruction'],
template: '<div><p>{{instruction.text}}</p></div>'
});

Vue.component('login', {
    props: ['value'],
    template: '<div>Username<input type="text" value="{{yolo}}">Password<input type="password"></div>'
})


