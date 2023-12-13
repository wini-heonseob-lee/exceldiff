
import { defineCustomElement } from 'https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.esm-browser.js'

/**
 * 사용 예시
 * 
 * 1. vue app 내부에서 사용하기
 * 
 *    vue component 처럼 vue의 template 문법과 같이 사용하기
 *    데이터를 컴포넌트로 내릴때는 props를 사용하고 이벤트 및 데이터를 부모로
 *    올릴때는 v-on:method를 사용하기
 *    - :value 를 통한 바인딩 가능
 *    - v-on을 통한 callback 바인딩 가능. component에서 emit으로 호출한다.
 *    
 *    주의: 일반 vue event 바인딩 처럼 
 *          @after 를 사용하면 binding은 되는데
            다음과 같이 오류가 표시된다.
            Uncaught DOMException: Failed to execute 'setAttribute' on 'Element': 
            '@after' is not a valid attribute name.   

    [예시]
    <div id="vueapp">
      ~~
      <my-vue-element
        status="new Vue 안에서 사용됨. "
        :count="count"
        v-on:after="afterxx"></my-vue-element>
 *
 * 2. custom element로 html에서 바로 사용하기
 *    custom element와 같이 param을 attribute로 전달하고
 *    addEventListner를 사용해서 event를 받아온다.
 *    eventListener를 추가해 줘야 해서 귀찮긴함.
 *    이 eventListener는 컴포넌트에서 외부로 호출하는 event를 
 *    외부에서 처리하기 위해 사용한다.
 *    
    [예시]
    <my-vue-element
        id="xx"
        status="custom element의 tag를 사용해서 만듬"
        count="1"></my-vue-element>
    <script>
    document.getElementById('xx').addEventListener('after', (v) => {
         console.log('after event called. ', v.detail)
     })
    </script>

 *         
 * 3. class로 사용하기
 *    자동으로 class로 만들어주고 param으로 props 전달
 *    custom event를 addEventListnenr로 받을 수 있음
 *  
    [예시]
    let ele3 = new MyVueElement({
        status: 'st3333',
        count: '88'
    });
    ele3.addEventListener('after', (v) => {
        console.log('after 3333 event called. ', v.detail)
    })

    document.body.appendChild(ele3)
 * 
 * 
 */

const MyVueElement = defineCustomElement({
  // 여기에 일반적인 Vue 컴포넌트 옵션을 작성합니다.
  // props는 class 문법으로 사용되는 경우 생성자 argument로도 전달 가능함
  props: {
    status: {
        type: String,
        default: 'init'
    },
    count: {
        type: Number,
        default: -1
    },
  },
  // 그냥 vue data와 같다.
  data: () => {
    return {
        user: 'hslee',
        cnt: 0
    }
  },
  // 컴포넌트에서 발생한 이벤트를 외부로 전달하기 위해 callback처럼
  // custom event를 정의할 수 있음. 
  // MyVueElement element에 
  // {ele}.addEventListner('after', () => {}) 이런식으로 사용 가능
  emits: [
    'after'
  ],
  methods: {
    test() {
        this.user = this.user + '+';
        this.cnt++;

        // custom event listener를 호출함
        this.$emit('after', this.cnt)
    }
  },
  // vue template이랑 같음
  template: /*html*/`
      <div>
        <h3>{{status}} count: <span>{{count}}</span> </h3>
        <span>{{after}}</span>
        <p>This is a Vue component with Shadow DOM.</p>
        <span>user is {{user}}</span>
        <div>
            {{cnt}}
          <button type="button" @click="test">add</button>
        </div>
      </div>
    `,
  // 쉐도우 루트에 주입되는 css는 외부 css에 영향을 주지 않고
  // 내부에서도 외부 css에 영향을 받지 않는다.
  // Array<string> 으로 입력하고 각 string은 <style></style>에 
  // 추가되서 쉐도우 루트에 추가된다.
  // defineCustomElement 전용: 쉐도우 루트에 주입될 CSS
  styles: [
    /*css*/`
    p { background-color: red; }
  `,/*css*/ `
    div {border: solid 1px black;}
  `]
})

// 사용자 정의 요소를 등록합니다.
// 등록 후 페이지의 모든 `<my-vue-element>` 태그가 사용가능
customElements.define('my-vue-element', MyVueElement)

// import 해서 new MyVueElement({}) 로 사용하는 경우는 
// 이렇게 export 해주고 사용한다.
export {MyVueElement};