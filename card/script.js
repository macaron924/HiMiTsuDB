let categoryList = [];

let filterSettings = {
    character: [],
    brand: [],
    music: [],
    category: []
}

let haveList = localStorage.getItem("cardHaveList");
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

fetch("./../data/card_data.json")
    .then((r) => r.json())
    .then((res) => {
        res.forEach((obj) => {
            const div = document.createElement("div");
            switch (obj.type) {
                case "ダンス":
                    div.className = "card type-dance";
                    break;
                case "うた":
                    div.className = "card type-sing";
                    break;
                case "ファッション":
                    div.className = "card type-fashion";
                    break;
                default:
                    div.className = "card";
            }

            let category1 = obj.category1;
            let category2 = obj.category2;
            if(!categoryList.includes(category1)) categoryList.push(category1);

            const ribbon1 = document.createElement("div");
            ribbon1.className = "ribbon ribbon1";
            div.appendChild(ribbon1);

            const ribbon2 = document.createElement("div");
            ribbon2.className = "ribbon ribbon2";
            div.appendChild(ribbon2);

            const itemID = obj.id;

            let category1str = "";
            let notPromotion = false;
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
                    notPromotion = true;
            }

            const idDiv = document.createElement("div");
            idDiv.className = "idDiv";
            if (notPromotion === true) {
                idDiv.innerText = itemID;
            } else {
                idDiv.innerText = "";
            }
            div.appendChild(idDiv);

            const brandDiv = document.createElement("div");
            brandDiv.className = "brandDiv";
            brandDiv.innerText = obj.brandName;
            div.appendChild(brandDiv);

            const charaDiv = document.createElement("div");
            charaDiv.className = "charaDiv";
            charaDiv.innerText = obj.character;
            div.appendChild(charaDiv);

            const nameDiv = document.createElement("div");
            nameDiv.className = "nameDiv";
            nameDiv.innerText = obj.cardName;
            div.appendChild(nameDiv);

            const musicDiv = document.createElement("div");
            musicDiv.className = "musicDiv";
            musicDiv.innerText = `💿 ${obj.music}`;
            div.appendChild(musicDiv);

            const categoryDiv = document.createElement("div");
            categoryDiv.className = "categoryDiv";
            categoryDiv.innerText = `${category1str} / ${category2}`;
            div.appendChild(categoryDiv);

            const numBoxDiv = document.createElement("div");
            numBoxDiv.className = "numBoxDiv";

            const haveRibbon = document.createElement("div");
            haveRibbon.className = "haveRibbon";
            const haveRibbonContent = document.createElement("div");
            haveRibbonContent.className = "haveRibbonContent";
            haveRibbon.appendChild(haveRibbonContent);

            const partIconDiv = document.createElement("div");
            partIconDiv.className = "partIconDiv";
            const cardIcon = document.createElement("span");
            cardIcon.className = "mdi--cards";
            partIconDiv.appendChild(cardIcon);

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
                    haveList[id] = newValue;
                    inp.classList.add("have");
                }
                localStorage.setItem("cardHaveList", JSON.stringify(haveList));
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
                    haveList[id] = newValue;
                    inp.classList.add("have");
                }
                localStorage.setItem("cardHaveList", JSON.stringify(haveList));
            })

            const numBox = document.createElement("input");
            numBox.type = "number";
            numBox.id = itemID;
            numBox.addEventListener("change", function() {
                const inp = this;
                const newValue = inp.value;

                const id = inp.id;
                if (newValue === 0){
                    delete haveList[id];
                    inp.classList.remove("have");
                }else {
                    haveList[id] = parseInt(newValue);;
                    inp.classList.add("have");
                }
                localStorage.setItem("cardHaveList", JSON.stringify(haveList));
            })
            if (haveList[itemID] !== undefined) {
                numBox.value = haveList[itemID];
                numBox.classList.add("have");
                numBoxDiv.classList.add("have")
            }

            numBoxDiv.appendChild(partIconDiv);
            numBoxDiv.appendChild(haveRibbon);
            numBoxDiv.appendChild(decrementButton);
            numBoxDiv.appendChild(numBox);
            numBoxDiv.appendChild(incrementButton);
            div.appendChild(numBoxDiv);

            document.getElementById("content").appendChild(div);

            obj.div = div;
            obj.connectedCategory = `${category1}/${category2}`;
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
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    filterSettings.category = filterSettings.category.filter(i => (i !== value));
                    filter();
                } else {
                    this.classList.add("active");
                    filterSettings.category.push(value);
                    filter();
                }
            })
            document.getElementById("category-select").appendChild(categoryButton);
        });

        document.querySelectorAll("#brand-select>button").forEach((button) => {
            button.addEventListener("click", function() {
                let value = this.value;
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    filterSettings.brand = filterSettings.brand.filter(i => (i !== value));
                    filter();
                } else {
                    this.classList.add("active");
                    filterSettings.brand.push(value);
                    filter();
                }
            })
        })
        document.querySelectorAll("#character-select>button").forEach((button) => {
            button.addEventListener("click", function() {
                let value = this.value;
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    filterSettings.character = filterSettings.character.filter(i => (i !== value));
                    filter();
                } else {
                    this.classList.add("active");
                    filterSettings.character.push(value);
                    filter();
                }
            })
        })
        
        function isMatchCategoryFilter(category) {
            if (filterSettings.category.length === 0) {
                return true;
            } else {
                if (filterSettings.category.includes(category)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        function isMatchBrandFilter(brand) {
            if (filterSettings.brand.length === 0) {
                return true;
            } else {
                if (filterSettings.brand.includes(brand)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        function isMatchCharacterFilter(character) {
            if (filterSettings.character.length === 0) {
                return true;
            } else {
                if (filterSettings.character.includes(character)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        function filter() {
            res.forEach((obj) => {
                if (isMatchCategoryFilter(obj.category1) === false) {
                    obj.div.style.display = "none";
                    return;
                }
                if (isMatchBrandFilter(obj.brandName) === false) {
                    obj.div.style.display = "none";
                    return;
                }
                if (isMatchCharacterFilter(obj.character) === false) {
                    obj.div.style.display = "none";
                    return;
                }
                obj.div.style.display = "block";
            })
        }
    })
