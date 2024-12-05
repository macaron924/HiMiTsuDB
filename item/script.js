const PART_LIST = ["one-piece", "tops", "bottoms", "shoes", "accessory"]
let categoryList = [];
let activeSelections = [];
let inputRefList = {};

let haveList = localStorage.getItem("itemHaveList");
haveList = haveList ? JSON.parse(haveList) : {};

const COMPRESS_MODE = "deflate-raw";

function isObject(o) {
    return (o instanceof Object && !(o instanceof Array)) ? true : false;
};

function sortHaveJson(json) {
    const keyList = Object.keys(json);
    keyList.sort();
    let newJson = {};
    keyList.forEach((key) => {
        newJson[key] = json[key];
    })
    return newJson;
}

Promise.all([
    fetch("./../data/item_data.json"),
    fetch("./../data/coordinate_data.json")
])
    .then((results) => Promise.all([results[0].json(), results[1].json()]))
    .then((res) => {
        let itemRes = res[0];
        let coordinateRes = res[1];

        itemRes.forEach((obj) => {
            inputRefList[obj.imageId] = [];
        })

        coordinateRes.forEach((obj) => {
            const div = document.createElement("div");
            div.className = "item";

            let category1 = obj.category1;
            let category2 = obj.category2;
            div.classList.add(`category-${category1}`);
            if(!categoryList.includes(category1)) categoryList.push(category1);

            const brandDiv = document.createElement("div");
            brandDiv.className = "brandDiv";
            brandDiv.innerText = obj.brandName;
            div.appendChild(brandDiv);

            const nameDiv = document.createElement("div");
            nameDiv.className = "nameDiv";
            nameDiv.innerText = obj.coordinateName;
            div.appendChild(nameDiv);

            let category1str = "";
            switch (category1) {
                case "special":
                    category1str = "スペシャル";
                    break;
                case "gumi":
                    category1str = "アイプリカード♪コレクショングミ";
                    break;
                case "millefeui":
                    category1str = "ミルフィーカード";
                    break;
                default:
                    category1str = `${category1}だん`;
            }
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "categoryDiv";
            categoryDiv.innerText = `${category1str} / ${category2}`;
            div.appendChild(categoryDiv);

            PART_LIST.forEach((part) => {
                const itemIdArray = obj[part].split(" ");
                const itemID = itemIdArray[0];
                if (itemID === "") return;

                let reStr = "";
                if (itemIdArray.length > 1) reStr = " re";

                const numBoxDiv = document.createElement("div");
                numBoxDiv.className = `numBoxDiv part-${part}${reStr}`;

                if (itemIdArray.length > 1) {
                    const reDetailDiv = document.createElement("div");
                    reDetailDiv.className = "reDetailDiv";
                    let originCategory1 = "";
                    let originCategory2 = "";
                    itemRes.forEach((item) => {
                        if (item.imageId === itemID) {
                            originCategory1 = item.category1;
                            originCategory2 = item.category2
                            return;
                        }
                    })
                    let originCategory1str = "";
                    switch (originCategory1) {
                        case "special":
                            originCategory1str = "スペシャル";
                            break;
                        case "gumi":
                            originCategory1str = "アイプリカード♪コレクショングミ";
                            break;
                        case "millefeui":
                            originCategory1str = "ミルフィーカード";
                            break;
                        default:
                            originCategory1str = `${category1}だん`;
                    }
                    reDetailDiv.innerText = `初登場: ${originCategory1str} / ${originCategory2}`;
                    numBoxDiv.appendChild(reDetailDiv);
                }

                const haveRibbon = document.createElement("div");
                haveRibbon.className = "haveRibbon";
                const haveRibbonContent = document.createElement("div");
                haveRibbonContent.className = "haveRibbonContent";
                haveRibbon.appendChild(haveRibbonContent);

                const partIconDiv = document.createElement("div");
                partIconDiv.className = "partIconDiv";

                const decrementButton = document.createElement("button");
                decrementButton.className = "decrement";
                decrementButton.innerText = "-";
                decrementButton.addEventListener("click", function() {
                    const inp = this.parentElement.querySelector("input");
                    const value = inp.value;
    
                    const newValue = value > 0 ? parseInt(value) - 1 : 0;
                    inp.value = newValue;
    
                    const id = inp.getAttribute("itemID");
                    if (newValue === 0){
                        delete haveList[id];
                        inp.classList.remove("have");
                    }else {
                        haveList[id] = newValue;
                        inp.classList.add("have");
                    }
                    localStorage.setItem("itemHaveList", JSON.stringify(haveList));

                    if (inputRefList[id].length > 1) {
                        inputRefList[id].forEach((element) => {
                            element.value = newValue;
                        })
                    }
                })

                const incrementButton = document.createElement("button");
                incrementButton.className = "increment";
                incrementButton.innerText = "+";
                incrementButton.addEventListener("click", function() {
                    const inp = this.parentElement.querySelector("input");
                    const value = inp.value;
    
                    const newValue = value === "" ? 1 : parseInt(value) + 1;
                    inp.value = newValue;
    
                    const id = inp.getAttribute("itemID");
                    if (newValue === 0){
                        delete haveList[id];
                        inp.classList.remove("have");
                    }else {
                        haveList[id] = newValue;
                        inp.classList.add("have");
                    }
                    localStorage.setItem("itemHaveList", JSON.stringify(haveList));

                    if (inputRefList[id].length > 1) {
                        inputRefList[id].forEach((element) => {
                            element.value = newValue;
                        })
                    }
                })

                const numBox = document.createElement("input");
                numBox.type = "number";
                numBox.setAttribute("itemID", itemID)
                numBox.addEventListener("change", function() {
                    const inp = this;
                    const newValue = inp.value;

                    const id = inp.getAttribute("itemID");
                    if (newValue === 0){
                        delete haveList[id];
                        inp.classList.remove("have");
                    }else {
                        haveList[id] = parseInt(newValue);
                        inp.classList.add("have");
                    }
                    localStorage.setItem("itemHaveList", JSON.stringify(haveList));

                    if (inputRefList[id].length > 1) {
                        inputRefList[id].forEach((element) => {
                            element.value = newValue;
                        })
                    }
                })
                if (haveList[numBox.getAttribute("itemID")] !== undefined) {
                    numBox.value = haveList[numBox.getAttribute("itemID")];
                    numBox.classList.add("have");
                    numBoxDiv.classList.add("have")
                }
                inputRefList[itemID].push(numBox)
                
                numBoxDiv.appendChild(partIconDiv);
                numBoxDiv.appendChild(haveRibbon);
                numBoxDiv.appendChild(decrementButton);
                numBoxDiv.appendChild(numBox);
                numBoxDiv.appendChild(incrementButton);
                div.appendChild(numBoxDiv);
            })

            //div.innerText = `${obj.brandName} / ${obj.coordinateName} / ${obj.part}`;
            document.getElementById("content").appendChild(div);

            obj.div = div;
        })
        
        categoryList.sort();
        categoryList.forEach((category) => {
            const categoryButton = document.createElement("button");
            categoryButton.value = category;
            let category1str = "";
            switch (category) {
                case "special":
                    category1str = "スペシャル";
                    break;
                case "gumi":
                    category1str = "アイプリカード♪コレクショングミ";
                    break;
                case "millefeui":
                    category1str = "ミルフィーカード";
                    break;
                default:
                    category1str = `${category}だん`;
            }
            categoryButton.innerHTML = category1str;
            categoryButton.addEventListener("click", function() {
                let value = this.value;
                if (activeSelections.length === 0) {
                    document.querySelectorAll(".item").forEach(element => {
                        element.classList.add("invisible");
                    })
                }
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    activeSelections = activeSelections.filter(i => (i !== value));
                    document.querySelectorAll(`.item.category-${value}`).forEach(element => {
                        element.classList.add("invisible");
                    })
                } else {
                    this.classList.add("active");
                    activeSelections.push(value);
                    document.querySelectorAll(`.item.category-${value}`).forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
                if (activeSelections.length === 0) {
                    document.querySelectorAll(".item").forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
            })
            document.getElementById("category-select").appendChild(categoryButton);
        });

        let brandSelections = [];
        document.querySelectorAll("#brand-select>button").forEach((button) => {
            button.addEventListener("click", function() {
                let value = this.value;
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    brandSelections = brandSelections.filter(i => (i !== value));
                    brandFilter(brandSelections);
                } else {
                    this.classList.add("active");
                    brandSelections.push(value);
                    brandFilter(brandSelections);
                }
            })
        })
        /*
        coordinateRes.forEach((obj) => {
            if (brandSelections.includes(obj.brandName)) {
                obj.div.style.display = "block";
            } else {
                obj.div.style.display = "none";
            }
        })*/
        function brandFilter(brandSelections) {
            if (brandSelections.length === 0) {
                coordinateRes.forEach((obj) => {
                    obj.div.style.display = "block";
                })
            } else {
                coordinateRes.forEach((obj) => {
                    if (brandSelections.includes(obj.brandName)) {
                        obj.div.style.display = "block";
                    } else {
                        obj.div.style.display = "none";
                    }
                })
            }
        }
    })

/*
fetch("./../data/item_data.json")
    .then((r) => r.json())
    .then((res) => {
        res.forEach((obj) => {
            const div = document.createElement("div");
            switch (obj.part) {
                case "ワンピ":
                    div.className = "item part-one-piece";
                    break;
                case "トップス":
                    div.className = "item part-tops";
                    break;
                case "ボトムス":
                    div.className = "item part-bottoms";
                    break;
                case "シューズ":
                    div.className = "item part-shoes";
                    break;
                case "アクセ":
                    div.className = "item part-accessory";
                    break;
                default:
                    div.className = "item";
            }

            let reStr = "";
            if (obj.re === true) {
                div.classList.add("re");
                reStr = " ※再録"
            }

            let category1 = obj.category1;
            let category2 = obj.category2;
            div.classList.add(`category-${category1}`);
            if(!categoryList.includes(category1)) categoryList.push(category1);

            const partIconDiv = document.createElement("div");
            partIconDiv.className = "partIconDiv";
            div.appendChild(partIconDiv);

            const brandDiv = document.createElement("div");
            brandDiv.className = "brandDiv";
            brandDiv.innerText = obj.brandName;
            div.appendChild(brandDiv);

            const partDiv = document.createElement("div");
            partDiv.innerText = obj.part;
            div.appendChild(partDiv);

            const nameDiv = document.createElement("div");
            nameDiv.innerText = obj.coordinateName;
            div.appendChild(nameDiv);

            let category1str = "";
            switch (category1) {
                case "special":
                    category1str = "スペシャル";
                    break;
                case "gumi":
                    category1str = "アイプリカード♪コレクショングミ";
                    break;
                case "millefeui":
                    category1str = "ミルフィーカード";
                    break;
                default:
                    category1str = `${category1}だん`;
            }
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "categoryDiv";
            categoryDiv.innerText = `${category1str} / ${category2}${reStr}`;
            div.appendChild(categoryDiv);

            const itemID = obj.imageId;

            const numBoxDiv = document.createElement("div");
            numBoxDiv.className = "numBoxDiv";
            const decrementButton = document.createElement("button");
            decrementButton.className = "decrement";
            decrementButton.innerText = "-";
            decrementButton.addEventListener("click", function() {
                const inp = this.parentElement.querySelector("input");
                const value = inp.value;

                const newValue = value > 0 ? parseInt(value) - 1 : 0;
                inp.value = newValue;

                const id = inp.id;
                if (newValue === 0){
                    delete haveList[id];
                    inp.classList.remove("have");
                }else {
                    haveList[id] = newValue.toString();
                    inp.classList.add("have");
                }
                localStorage.setItem("itemHaveList", JSON.stringify(haveList));
            })
            const incrementButton = document.createElement("button");
            incrementButton.className = "increment";
            incrementButton.innerText = "+";
            incrementButton.addEventListener("click", function() {
                const inp = this.parentElement.querySelector("input");
                const value = inp.value;

                const newValue = value === "" ? 1 : parseInt(value) + 1;
                inp.value = newValue;

                const id = inp.id;
                if (newValue === 0){
                    delete haveList[id];
                    inp.classList.remove("have");
                }else {
                    haveList[id] = newValue.toString();
                    inp.classList.add("have");
                }
                localStorage.setItem("itemHaveList", JSON.stringify(haveList));
            })
            const numBox = document.createElement("input");
            numBox.type = "number";
            numBox.id = itemID;
            if (haveList[itemID] !== undefined) {
                numBox.value = haveList[itemID];
                numBox.classList.add("have");
            }
            numBoxDiv.appendChild(decrementButton);
            numBoxDiv.appendChild(numBox);
            numBoxDiv.appendChild(incrementButton);
            div.appendChild(numBoxDiv);

            //div.innerText = `${obj.brandName} / ${obj.coordinateName} / ${obj.part}`;
            document.getElementById("content").appendChild(div);
        })

        categoryList.sort();
        categoryList.forEach((category) => {
            const categoryButton = document.createElement("button");
            categoryButton.value = category;
            let category1str = "";
            switch (category) {
                case "special":
                    category1str = "スペシャル";
                    break;
                case "gumi":
                    category1str = "アイプリカード♪コレクショングミ";
                    break;
                case "millefeui":
                    category1str = "ミルフィーカード";
                    break;
                default:
                    category1str = `${category}だん`;
            }
            categoryButton.innerHTML = category1str;
            categoryButton.addEventListener("click", function() {
                let value = this.value;
                if (activeSelections.length === 0) {
                    document.querySelectorAll(".item").forEach(element => {
                        element.classList.add("invisible");
                    })
                }
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    activeSelections = activeSelections.filter(i => (i !== value));
                    document.querySelectorAll(`.item.category-${value}`).forEach(element => {
                        element.classList.add("invisible");
                    })
                }
                else {
                    this.classList.add("active");
                    activeSelections.push(value);
                    document.querySelectorAll(`.item.category-${value}`).forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
                if (activeSelections.length === 0) {
                    document.querySelectorAll(".item").forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
            })
            document.getElementById("category-select").appendChild(categoryButton);
        });

        document.getElementById("storageImport").addEventListener("click", function() {
            let inputText = document.getElementById("dataInput").value;
            try {
                if(isObject(JSON.parse(inputText)) === false) throw "IsNotValidObjectError";
            } catch(error) {
                this.innerText = "インポート失敗。";
                setTimeout(() => {
                    this.innerText = "インポート";
                }, 1000);
                return -1;
            }
            haveList = JSON.parse(inputText);
            localStorage.setItem("itemHaveList", JSON.stringify(haveList));
            this.innerText = "インポート完了。1秒後にリロードします...";
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1000);
        })

        document.getElementById("storageExport").addEventListener("click", function() {
            let data = haveList;
            document.getElementById("dataInput").value = JSON.stringify(data);
        })

        document.getElementById("storageReset").addEventListener("click", function() {
            localStorage.removeItem("itemHaveList");
            this.innerText = "保存リセット完了。1秒後にリロードします...";
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1000);
        })
    })
*/
