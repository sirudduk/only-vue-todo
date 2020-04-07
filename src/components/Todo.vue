<template>
  <div class="todo-container">

    <!-- todo 추가 -->
    <div class="add">
      <input type="text" class="add-text is-full" v-model="newItem.title" placeholder="오늘의 할일을 입력해주세요">
      <button class="add-btn" @click="add">
        <font-awesome-icon icon="plus"></font-awesome-icon>
      </button>
    </div>

    <div class="contents">
      <div :class="['content', {'done': item.done}]" v-for="(item) in vList" :key="item.id">


        <div class="tools">
          
          <!-- edit 모드 -->
          <template v-if="editMode == item.id">
            <div class="tools-left">
              <!-- 우선순위 설정 -->
              <select v-model="editItem.priority">
                <option :value="0">높음</option>
                <option :value="1">중간</option>
                <option :value="2">낮음</option>
              </select>
              <!-- 디데이 설정 -->
              <input class="d-day" type="number" v-model="editItem.due" placeholder="d-day를 설정해주세요.">
            </div>
            <font-awesome-icon class="check-btn" icon="check" @click="save(item.id)"></font-awesome-icon>
          </template>

          <!-- view 모드 -->
          <template v-else>
            <div class="tools-left">
              <font-awesome-icon :class="vPriority(item.priority)" icon="circle"></font-awesome-icon>
              <span v-if="item.due" class="d-day">d-day {{item.due}}</span>
            </div>
            <div>
              <font-awesome-icon class="edit-btn" icon="edit" @click="edit(item.id)"></font-awesome-icon>
              <font-awesome-icon :class="['done-btn', {'done-active': item.done}]" 
                icon="check-square" 
                @click="item.done = !item.done">
              </font-awesome-icon>
            </div>
          </template>
        </div>
        
        <!-- 제목 -->
        <div class="title-wrap">
          <input type="text is-full" v-if="editMode == item.id" v-model="editItem.title">
          <span v-else>{{item.title}}</span>
        </div>

        <!-- 메모 -->
        <div class="detail-wrap">
          <textarea class="detail is-full"  v-if="editMode == item.id" v-model="editItem.content"></textarea>
          <p class="detail" v-else>
            {{item.content}}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Todo',

  data () {
    return {
      editMode: null,

      newItem: {
        // default
        id: 9999, //임의의 id값
        title: "",
        content: "",
        due: null,
        priority: 2,
        done: false
      },

      editItem: {
        id: null,
        title: "",
        content: "",
        due: null,
        priority: 2,
        done: false
      },

      list: [
        // {
        //   title: "제목입니다",
        //   content: "내용입니다",
        //   due: 3,
        //   priority: 0,
        //   done: false
        // }
      ]
    }
  }, 

  computed: {
    vList () {
      // 완료 상태 - 우선순위 - 디데이 순으로 sort
      return this.list.slice().sort((a,b) => {
        return a.due - b.due;
      }).sort((a,b) => {
        return a.priority - b.priority;
      }).sort((a,b) => {
          return Number(a.done) - Number(b.done);
      })
    }
  },

  methods: {
    edit (id) {
      this.editMode = id;

      this.editItem = Object.assign({}, this.list.find((a) => {
        return id == a.id
      }));
    },

    save (id) {
      Object.assign(this.list.find((a) => {
        return id == a.id
      }), this.editItem);
      
      this.editMode = null;
    },

    add () {
      this.list.push(Object.assign({}, this.newItem));
      this.newItem.title = "";
      // 임의의 id값 부여하기 위함
      this.newItem.id++;
    },

    getTodo () {
      this.$http.get('http://localhost:3000/todo')
      .then((result) => {
        this.list = result.data;
      })
    },

    vPriority (priority) {
      // 우선순위에 따라 ui 설정
      return {
        0: 'priority-high',
        1: 'priority-middle',
        2: 'priority-low'
      }[priority];
    }
  },

  created () {
    this.getTodo();
  }
}
</script>

<style lang="scss">

  @import url("~reset-css/reset.css");

  $primary: hsl(171, 100%, 41%);

  // helper
  .is-full {
    width: 100%;
  }

  .todo-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .add {
      display: flex;
      height: 40px;
      background: #46BD94;
      padding: 15px;
      .add-btn {
        font-size: 15px;
        width: 50px;
        border-radius: 0 10px 10px 0;
        color: dimgray;
        border: none;
        &:hover {
          color: $primary;
        }
      }
      .add-text {
        background: #63CDA6;
        border-radius: 10px 0 0 10px;
        border: 0;
        padding: 0 15px;
        color: #fff;
        outline: none;
      }
      .add-text::placeholder {
        color: white;
      }
    }
    .contents {
      height: 100%;
      overflow: scroll;
      padding: 25px;
      .done {
        opacity: 0.3;
      }
      .content {
        background: white;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0px 1px 2px rgba(44,62,80,0.10);
        padding: 15px;
        color: dimgray;
        .title-wrap, .tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tools {
          .priority-high {
            color: #FF6961;
          }
          .priority-middle {
            color: #FDFD96;
          }
          .priority-low {
            color: #87ceeb;
          }
          .tools-left {
            display: flex;
            align-items: center;
            .d-day {
              font-size: 0.8rem;
              margin-left: 5px;
              color: darkgray;
            }
          }
          .done-btn, .edit-btn, .check-btn {
            margin-left: 10px;
            cursor: pointer;
            font-size: 1.5rem;
            &:hover {
              color: $primary;
            }
          }
          .done-active {
            color: $primary;
          }
        }
        .title-wrap {
          margin: 15px 0 20px 0;
          font-size: 1.3rem;
        }
      }
    }
  }

</style>
