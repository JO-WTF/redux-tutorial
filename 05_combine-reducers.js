// Tutorial 05 - combine-reducers.js

// We're now starting to get a grasp of what a reducer is...
现在，你应该已经掌握了修改器的基本内容。
我们来看看现在的代码：

var reducer_0 = function (state = {}, action) {
    console.log('reducer_0 was called with state', state, 'and action', action)

    switch (action.type) {
        case 'SAY_SOMETHING':
            return {
                ...state,
                message: action.value
            }
        default:
            return state;
    }
}

// ... but before going further, we should start wondering what our reducer will look like when
// we'll have tens of actions:
在继续之前，我们先考虑一下，如果有几十种不同的行为，我们的修改器会变成什么样。

var reducer_1 = function (state = {}, action) {
    console.log('reducer_1 was called with state', state, 'and action', action)

    switch (action.type) {
        case 'SAY_SOMETHING':
            return {
                ...state,
                message: action.value
            }
        case 'DO_SOMETHING':
            // ...
        case 'LEARN_SOMETHING':
            // ...
        case 'HEAR_SOMETHING':
            // ...
        case 'GO_SOMEWHERE':
            // ...
        // etc.
        default:
            return state;
    }
}

// It becomes quite evident that a single reducer function cannot hold all our
// application's actions handling (well it could hold it, but it wouldn't be very maintainable...).
几十个case语句？
显然如果有非常多不同的行为，单凭一个修改器是无法满足要求的。
虽然一个修改器的确可以装得下，但是日后进行代码维护的时候一定会让你菊花一紧。
// Luckily for us, Redux doesn't care if we have one reducer or a dozen and it will even help us to
// combine them if we have many!
好消息是，Redux并不在乎我们有多少个修改器，一个也好，几十个也好，都无所谓。
因为Redux会帮助我们把多个修改器合并到一起。

// Let's declare 2 reducers
我们来定义两个修改器吧。

var userReducer = function (state = {}, action) {
    console.log('userReducer was called with state', state, 'and action', action)

    switch (action.type) {
        // etc.
        default:
            return state;
    }
}
var itemsReducer = function (state = [], action) {
    console.log('itemsReducer was called with state', state, 'and action', action)

    switch (action.type) {
        // etc.
        default:
            return state;
    }
}
上面两个修改器不管收到任何行为，都只会输出自己收到的当前状态和执行的行为。
然而不管执行什么行为，修改器都只是返回当前状态而已。
// I'd like you to pay special attention to the initial state that was actually given to
// each reducer: userReducer got an initial state in the form of a literal object ({}) while
// itemsReducer got an initial state in the form of an array ([]). This is just to
// make clear that a reducer can actually handle any type of data structure. It's really
// up to you to decide which data structure suits your needs (an object literal, an array,
// a boolean, a string, an immutable structure, ...).
注意：两个修改器的默认初始状态是不同的。一个是空对象{},一个是空数组[]。

// With this new multiple reducer approach, we will end up having each reducer handle only
// a slice of our application state.
现在我们有了两个修改器。通过这两个修改器，我们可以让它们各自负责app的一部分状态。


// But as we already know, createStore expects just one reducer function.
问题来了，我们在之前创建存储器的时候，createStore函数可是只能接受一个修改器函数的。

// So how do we combine our reducers? And how do we tell Redux that each reducer will only handle
// a slice of our state?
怎么办？我们怎么才能把两个修改器合并到一起呢？
// It's fairly simple. We use Redux combineReducers helper function. combineReducers takes a hash and
// returns a function that, when invoked, will call all our reducers, retrieve the new slice of state and
// reunite them in a state object (a simple hash {}) that Redux is holding.
实际上，非常简单，用Redux提供的合并修改器（combineReducers）函数就可以了。
combineReducers会把多个修改器合并到一起，成为一个主修改器。
// Long story short, here is how you create a Redux instance with multiple reducers:
这里我省略一些难懂的内容，我们直接来看看怎么合并多个修改器吧。
import { createStore, combineReducers } from 'redux'

var reducer = combineReducers({
    user: userReducer,
    items: itemsReducer
})
// Output:
// userReducer was called with state {} and action { type: '@@redux/INIT' }
// userReducer was called with state {} and action { type: '@@redux/PROBE_UNKNOWN_ACTION_9.r.k.r.i.c.n.m.i' }
// itemsReducer was called with state [] and action { type: '@@redux/INIT' }
// itemsReducer was called with state [] and action { type: '@@redux/PROBE_UNKNOWN_ACTION_4.f.i.z.l.3.7.s.y.v.i' }
var store_0 = createStore(reducer)
// Output:
// userReducer was called with state {} and action { type: '@@redux/INIT' }
// itemsReducer was called with state [] and action { type: '@@redux/INIT' }

// As you can see in the output, each reducer is correctly called with the init action @@redux/INIT.
看上面的输出内容，我们会发现这两个修改器都成功初始化了。
// But what is this other action? This is a sanity check implemented in combineReducers
// to assure that a reducer will always return a state != 'undefined'.
但是另外一个奇怪的行为"@@redux/PROBE_UNKNOWN_ACTION_*.*.*.*.*..."是什么呢？
其实你不需要知道。
但如果你好奇，那我可以告诉你，这是combineReducers函数的一个例行检查，确保修改器不返回未定义的新状态。

// Please note also that the first invocation of init actions in combineReducers share the same purpose
// as random actions (to do a sanity check).


console.log('store_0 state after initialization:', store_0.getState())
// Output:
// store_0 state after initialization: { user: {}, items: [] }

// It's interesting to note that Redux handles our slices of state correctly,
我们再来看看Redux是如何处理app的状态的。
// the final state is indeed a simple hash made of the userReducer's slice and the itemsReducer's slice:
// {
//     user: {}, // {} is the slice returned by our userReducer
//     items: [] // [] is the slice returned by our itemsReducer
// }
app最后的状态，如上面的结果所示，分成了两部分，分别由两个修改器负责。

// Since we initialized the state of each of our reducers with a specific value ({} for userReducer and
// [] for itemsReducer) it's no coincidence that those values are found in the final Redux state.
还记得当初我们给两个修改器分别赋予了不同的默认初始状态吧？
观察输出的新状态，跟设置的值相符，证明我们的确做对了。
// By now we have a good idea of how reducers will work. It would be nice to have some
// actions being dispatched and see the impact on our Redux state.
现在你应该懂了修改器的工作原理，现在来试试执行一些行为，观察它们对状态的影响吧。

// Go to next tutorial: 06_dispatch-action.js
