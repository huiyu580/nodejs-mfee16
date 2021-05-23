## (1) 請問下列程式執行後的結果為何？為什麼？

console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 1000);
})();

### Ans: 
    start
    IIFE
    Timeout
    按照順序會先執行全域的console.log("start")，再執行全域function中的console.log("IIFE")，等待一秒後執行console.log("Timeout")

console.log("end");
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
    先執行全域的console.log("start")，接著執行全域函式IIFE，全域的console.log("end")，setTimeout的函示會被放到最後執行

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
    函式被呼叫後才會執行，首先執行了console.log("foo")，接著執行函式內的bar()和baz()函式

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
    有setTimeout的函式被最後執行