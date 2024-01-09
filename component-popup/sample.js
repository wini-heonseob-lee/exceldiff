import { defineCustomElement } from 'https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.esm-browser.js'

const PopExam = defineCustomElement({
    props: {
        text: {
            type: String,
            default: 'doc manager'
        },
        // emit을 사용안한건 emit은 return값을 전달 못해서...
        getDataCallback: {
            type: Function,
            default: null
        },
        // emit을 사용안한건 emit은 return값을 전달 못해서...
        updateDataCallback: {
            type: Function,
            default: null
        }
    },
    data: () => {
        return {
            req: {

            },
            data: {
                value1: '',
                value2: '',
            },
            title: 'init',
            updateDataKey: 1,
            downloadExcelKey: 1
        }
    },
    async created() {
        if (!this.getDataCallback || !this.updateDataCallback) {
            alert('API가 설정되지 않았음.')
            this.closeDialog();
            return;
        }
        
    },
    async mounted() {
        this.title = 'loading.....';
        console.log('dialog - 초기화 데이터를 불러온다. ', this.data);
        this.data = await this.getDataCallback();
        console.log('dialog - 초기화 데이터 불러옴', this.data);
        this.title = 'props is ' + this.text;

        // 마운트가 되어야 조작할 수 있음
        let pop = document.querySelector('pop-exam');
        let dialog = pop.shadowRoot.querySelector('dialog');
        dialog.showModal();
    },
    methods: {
        // 컴포넌트에서 사용할 버튼 처리
        // props로 받은 callback 함수 호출하고 결과를 처리
        // emit을 사용안한건 emit은 return값을 전달 못해서...
        async updateData() {
            try {
                console.log('dialog - update 요청할 데이터: ', this.data);
                let result = await this.updateDataCallback(this.data);
                if (result !== 'success') {
                    alert('업데이트 중 오류 발생 ');
                    return;
                }
                console.log('dialog - 업데이트가 되었습니다. ' )
            } finally {
                // click once 버튼을 다시 사용하기 위해서 reset
                // https://stackoverflow.com/a/56041872
                this.updateDataKey++;
            }
        },
        downloadExcel() {
            console.log('download: ', this.data);
            this.downloadExcelKey++;
        },
        // 컴포넌트에서 사용할 close 버튼 처리
        closeDialog() {
            document.querySelector('pop-exam').remove();
        }
    },
    // vue template이랑 같음
    template: /*html*/`
        <dialog>
            <button @click="closeDialog">Close</button>
            <h3>status: {{title}}</h3>
            <div>
                <form>
                    value1 : <input type="text" v-model="data.value1"> <br>
                    value2 : <input type="text" v-model="data.value2"> <br>

                    <button :key="updateDataKey"
                            @click.once="updateData" 
                            type="button"> 업데이트 </button>

                    <button :key="downloadExcelKey"
                            @click.once="downloadExcel" 
                            type="button"> 다운로드 </button>
                </form>
            </div>
        </dialog>
        `,
    styles: [
    ]
})

customElements.define('pop-exam', PopExam)

export {PopExam};
