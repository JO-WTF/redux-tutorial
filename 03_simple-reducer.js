// Tutorial 03 - simple-reducer.js
一个简单的修改器

// Now that we know how to create a Redux instance that will hold the state of our application
// we will focus on those reducer functions that will allow us to transform this state.
学习了上一节内容，你已经知道了如何去创建一个存储app状态（state）的容器（也就是上一节说的存储器，亦即store）
接下来，我们要来创建一个修改器（也就是reducer），用于修改app的状态（state）。

// A word about reducer VS store:
// As you may have noticed, in the flux diagram shown in the introduction, we had "Store", not
// "Reducer" like Redux is expecting. So how exactly do Store and Reducer differ?
// It's more simple than you could imagine: A Store keeps your data in it while a Reducer doesn't.
// So in traditional flux, stores hold state in them while in Redux, each time a reducer is
// called, it is passed the state that needs to be updated. This way, Redux's stores became
// "stateless stores" and were renamed reducers.

// As stated before, when creating a Redux instance you must give it a reducer function...
上一节我们说过，当你在创建Redux存储器的时候，你必须同时给它创建一个修改器（reducer）

import { createStore } from 'redux'

var store_0 = createStore(() => {})

有了这个修改器，当app中有行为（action）发生的时候，Redux就会调用这个修改器函数，进而修改app的状态。

// ... so that Redux can call this function on your application state each time an action occurs.
// Giving reducer(s) to createStore is exactly how redux registers the action "handlers" (read reducers) we
// were talking about in section 01_simple-action-creator.js.

// Let's put some log in our reducer
这里，我们创建一个修改器（reducer）。在这个修改器中，我们传递一些参数（args）到修改器函数中，并且通过console.log输出到控制台。

var reducer = function (...args) {
    console.log('Reducer was called with args', args)
}

var store_1 = createStore(reducer)

注意看store_0和store_1这两个存储器到区别。

// Output: Reducer was called with args [ undefined, { type: '@@redux/INIT' } ]
上面的修改器输出的内容是：Reducer was called with args [ undefined, { type: '@@redux/INIT' } ]

注意看，我们并没有执行（dispatch）任何行为，修改器就已经被调用了。
这是因为一开始运行app的时候，Redux需要执行一次初始化行为，以获得app的初始状态
而这个初始化的行为（init action），就是上面控制台中输出的 {type: '@@redux/INIT'} 这一部分

// Did you see that? Our reducer is actually called even if we didn't dispatch any action...
// That's because to initialize the state of the application,
// Redux actually dispatches an init action ({ type: '@@redux/INIT' })

当修改器被调用时，有两个参数会被传递给它：状态和行为（state, action)。
结合上面的输出内容，我们知道初始状态是未定义（undefined），而行为是初始化（@@redux/INIT）。
不难理解，当app刚开始运行的时候，状态是未定义的。因为它还没有被初始化，只有初始化之后，才能够得到真正的状态。
// When called, a reducer is given those parameters: (state, action)
// It's then very logical that at an application initialization, the state, not being
// initialized yet, is "undefined"

// But then what is the state of our application after Redux sends its "init" action?
那么，在初始化之后，我们这个app的状态会变成什么呢？

// Go to next tutorial: 04_get-state.js
