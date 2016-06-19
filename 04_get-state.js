// Tutorial 04 - get-state.js

// How do we retrieve the state from our Redux instance?
我们如何才能从redux的存储器中获取当前状态呢？

import { createStore } from 'redux'

var reducer_0 = function (state, action) {
    console.log('reducer_0 was called with state', state, 'and action', action)
    //这个修改器实际上什么都不修改，只是告诉我们当前状态和发生的行为而已。
}

var store_0 = createStore(reducer_0)
// Output: reducer_0 was called with state undefined and action { type: '@@redux/INIT' }
上面的代码会输出：reducer_0 was called with state undefined and action { type: '@@redux/INIT' }
如果你仔细读了上一节，你应该没有人和疑问。

// To get the state that Redux is holding for us, you call getState
现在我们想知道，初始化之后的状态变成了什么。
要获取当前的状态，我们使用 getState 函数。

console.log('store_0 state after initialization:', store_0.getState())
// Output: store_0 state after initialization: undefined
注意看，getState是存储器自身的方法，可以直接调用。
输出的结果是：store_0 state after initialization: undefined

// So the state of our application is still undefined after the initialization? Well of course it is,
// our reducer is not doing anything... Remember how we described the expected behavior of a reducer in
// "about-state-and-meet-redux"?
//     "A reducer is just a function that receives the current state of your application, the action,
//     and returns a new state modified (or reduced as they call it)"
// Our reducer is not returning anything right now so the state of our application is what
// reducer() returns, hence "undefined".
怎么回事？不是已经初始化了吗？状态怎么还是未定义（undefined）？
傻缺，当然应该是未定义啦！因为我们的修改器什么都没做啊...

还记得我们在之前章节是怎么介绍修改器的吗？
“修改器只是一个函数。这个函数会接受两个参数，一个是app当前的状态，一个是发生的行为。根据这两个参数，修改器进行一些操作，然后，返回一个新的状态。”
现在的问题是，我们的修改器并没有进行修改操作，也没有返回什么（return ***)。所以app的状态依然是未定义。

// Let's try to send an initial state of our application if the state given to reducer is undefined:
既然是这样，那我们就让修改器定义一下app的初始状态吧。
我们的想法是这样的：如果修改器接收到的当前状态是未定义，那我们就返回点什么东西。
但是我没有想好要返回什么，那就返回一个空对象吧（empty object，也就是{}）

var reducer_1 = function (state, action) {
    console.log('reducer_1 was called with state', state, 'and action', action)
    if (typeof state === 'undefined') {
        return {}
        // {} 就是我们要返回点空对象
    }

    return state;
}

var store_1 = createStore(reducer_1)
// Output: reducer_1 was called with state undefined and action { type: '@@redux/INIT' }
输出内容当然是： reducer_1 was called with state undefined and action { type: '@@redux/INIT' }
应该没有任何疑问。

console.log('store_1 state after initialization:', store_1.getState())
// Output: store_1 state after initialization: {}
输出内容：store_1 state after initialization: {}

// As expected, the state returned by Redux after initialization is now {}
很好，现在我们看到，经过初始化，新的状态已经变成了一个空的对象 {}。
// There is however a much cleaner way to implement this pattern thanks to ES6:

var reducer_2 = function (state = {}, action) {
    //在传递的参数中，我们给状态设置了默认值：空的对象 {}
    console.log('reducer_2 was called with state', state, 'and action', action)
    //if (typeof state === 'undefined') {
    //    return {}
    //}
    //这几行不需要了
    return state;
}

var store_2 = createStore(reducer_2)
// Output: reducer_2 was called with state {} and action { type: '@@redux/INIT' }
输出内容：reducer_2 was called with state {} and action { type: '@@redux/INIT' }

console.log('store_2 state after initialization:', store_2.getState())
// Output: store_2 state after initialization: {}
输出内容：store_2 state after initialization: {}

// You've probably noticed that since we've used the default parameter on state parameter of reducer_2,
// we no longer get undefined as state's value in our reducer's body.
现在我们看到，在reducer_2这个修改器中，我们给状态参数设置了一个默认值
这个默认值的作用，相信你也猜得到：如果当前的状态是未定义，那就使用默认值{}
因此我们在输出中都不会看到undefined了。

当然你应该也注意到了，reducer_1和reducer_2 是有实际区别的。
在传递参数进reducer_1时，状态是未定义，经过修改才变成{};而在reducer_2中，状态在传递进函数的时候就已经是{}了。

// Let's now recall that a reducer is only called in response to an action dispatched and
// let's fake a state modification in response to an action type 'SAY_SOMETHING'
不知道你还记不记得，修改器只有在执行某个行为的时候才会被调用。
上面的修改器被调用，是因为redux执行了初始化行为。
那我们现在来试着执行一个行为，来修改app的状态。这个行为，就叫做“说点什么（SAY_SOMETHING)”吧。


var reducer_3 = function (state = {}, action) {
    console.log('reducer_3 was called with state', state, 'and action', action)

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

var store_3 = createStore(reducer_3)
// Output: reducer_3 was called with state {} and action { type: '@@redux/INIT' }


console.log('store_3 state after initialization:', store_3.getState())
// Output: redux state after initialization: {}
迄今为止，控制台的输出内容不会有任何变化。毕竟我们还没有执行任何行为。
但是在上面的这个例子当中，有一些东西需要注意。
// Nothing new in our state so far since we did not dispatch any action yet. But there are few
// important things to pay attention to in the last example:
//     0) I assumed that our action contains a type and a value property. The type property is mostly
//        a convention in flux actions and the value property could have been anything else.
        0) 我假设我们要执行的行为包含两部分内容，一个是行为的类型（type），另一个是值（value）。
//     1) You'll often see the pattern involving a switch to respond appropriately
//        to an action received in your reducers
        1) 你以后在修改器中会经常看到switch语句。
        因为我们可能会执行各种行为，而修改器根据行为的不同，会执行不同的操作。
//     2) When using a switch, NEVER forget to have a "default: return state" because
//        if you don't, you'll end up having your reducer return undefined (and lose your state).
        2) 使用switch语句的时候，千万不要忘了加上 "default: return state" 这一句。
        如果你不加，当修改器收到了未知行为的时候，会返回未定义（undefined）的新状态。
        你之前的状态就没啦～
//     3) Notice how we returned a new state made by merging current state with { message: action.value },
//        all that thanks to this awesome ES7 notation (Object Spread): { ...state, message: action.value }
        3) 注意看我们怎么把当前状态和新状态合并在一起的。
        当前状态我们使用{...state}表示，而新状态是{message: action.value},
        因此最后返回合并后的对象{ ...state, message: action.value }
//     4) Note also that this ES7 Object Spread notation suits our example because it's doing a shallow
//        copy of { message: action.value } over our state (meaning that first level properties of state
//        are completely overwritten - as opposed to gracefully merged - by first level property of
//        { message: action.value }). But if we had a more complex / nested data structure, you might choose
//        to handle your state's updates very differently:
//        - using Immutable.js (https://facebook.github.io/immutable-js/)
//        - using Object.assign (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
//        - using manual merge
//        - or whatever other strategy that suits your needs and the structure of your state since
//          Redux is absolutely NOT opinionated on this (remember, Redux is a state container).

// Now that we're starting to handle actions in our reducer let's talk about having multiple reducers and
// combining them.
上面的例子中，我们在修改器中处理一个叫做“说点什么”的行为。接下来，我们来试着多创建几个行为，并且把它们合并到一起吧。

// Go to next tutorial: 05_combine-reducers.js
