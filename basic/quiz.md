## (1) 請問下列程式執行後的結果為何？為什麼？

console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 1000);
})();

console.log("end");

### Ans: 
    start
    IIFE
    end
    Timeout

    第一行程式 console.log("start") 會先被丟入stack中執行  
    ->  第二個function被丟入stack中執行， console.log("IIFE") 會先被執行，而callback function console.log("Timeout") 則被傳入web api等待一秒後傳入queue中 
    ->  第三段程式 console.log("end") 被執行
    ->  event loop將在queue中等待的 console.log("Timeout") 傳入空的stack中執行
    
## (2) 請問下列程式執行的結果為何？為什麼？

console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 0);
})();

console.log("end");

### Ans:
    start
    IIFE
    end
    Timeout

    第一行程式 console.log("start") 會先被丟入stack中執行  
    ->  第二個function被丟入stack中執行， console.log("IIFE") 會先被執行，而callback function console.log("Timeout") 則被傳入web api後隨即傳入queue中 
    ->  第三段程式 console.log("end") 被執行
    ->  event loop將在queue中等待的 console.log("Timeout") 傳入空的stack中執行

## (3) 請問下列程式執行的結果為何？為什麼？

const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
    console.log("foo");
    bar();
    baz();
};

foo();

### Ans:
    foo
    bar
    baz

    函式 foo() 被呼叫後被丟入stack中執行，首先印出了foo，
    ->  接著在函式中呼叫了bar()，bar()被丟入stack中執行，印出了bar，
    ->  最後又呼叫了baz()，baz()被丟入stack中執行並印出baz

## (4) 請問下列程式執行的結果為何？為什麼？

const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
    console.log("foo");
    setTimeout(bar, 0);
    baz();
};

foo();

### Ans:
    foo
    baz
    bar
    
    函式 foo() 被呼叫後被丟入stack中執行，首先印出了foo，
    ->  接著在函式中呼叫了setTimeout，bar這個函式被丟入api後隨即(0 ms)進入queue中等待
    ->  接著呼叫了baz()，baz()被丟入stack中執行並印出baz
    ->  等待stack清空後，event loop將等待中的bar()丟入stack中執行，印出了bar