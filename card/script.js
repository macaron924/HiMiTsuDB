let categoryList = [];
let activeSelections = [];

let haveList = localStorage.getItem("cardHaveList");
haveList = haveList ? JSON.parse(haveList) : {};

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
            div.classList.add(`category-${category1}`);
            if(!categoryList.includes(category1)) categoryList.push(category1);

            const ribbon1 = document.createElement("div");
            ribbon1.className = "ribbon ribbon1";
            div.appendChild(ribbon1);

            const ribbon2 = document.createElement("div");
            ribbon2.className = "ribbon ribbon2";
            div.appendChild(ribbon2);

            const brandDiv = document.createElement("div");
            brandDiv.className = "brandDiv";
            brandDiv.innerText = obj.brandName;
            div.appendChild(brandDiv);

            const charaDiv = document.createElement("div");
            charaDiv.innerText = obj.character;
            div.appendChild(charaDiv);

            const nameDiv = document.createElement("div");
            nameDiv.innerText = obj.cardName;
            div.appendChild(nameDiv);

            const musicDiv = document.createElement("div");
            musicDiv.className = "musicDiv";
            musicDiv.innerText = `💿 ${obj.music}`;
            div.appendChild(musicDiv);

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

            const itemID = obj.id;

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

                const id = inp.id.split("_")[0];
                if (newValue == 0){
                    delete haveList[id];
                    inp.classList.remove("have");
                }else {
                    haveList[id] = newValue.toString();
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
                
                const newValue = value == "" ? 1 : parseInt(value) + 1;
                inp.value = newValue;
                
                const id = inp.id.split("_")[0];
                if (newValue == 0){
                    delete haveList[id];
                    inp.classList.remove("have");
                }else {
                    haveList[id] = newValue.toString();
                    inp.classList.add("have");
                }
                localStorage.setItem("cardHaveList", JSON.stringify(haveList));
            })
            const numBox = document.createElement("input");
            numBox.type = "number";
            numBox.id = `${itemID}_1`;
            if (haveList[itemID] != undefined) {
                numBox.value = haveList[itemID];
                numBox.classList.add("have");
            }
            numBoxDiv.appendChild(decrementButton);
            numBoxDiv.appendChild(numBox);
            numBoxDiv.appendChild(incrementButton);
            div.appendChild(numBoxDiv);

            //div.innerText = `${obj.brandName} / ${obj.character} / ${obj.cardName}`;
            document.getElementById("content").appendChild(div);
        })

        categoryList.sort();
        for (let i in categoryList) {
            const categoryButton = document.createElement("button");
            categoryButton.value = categoryList[i];
            let category1str = "";
            switch (categoryList[i]) {
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
                    category1str = `${categoryList[i]}だん`;
            }
            categoryButton.innerHTML = category1str;
            categoryButton.addEventListener("click", function() {
                let value = this.value;
                if (activeSelections.length == 0) {
                    document.querySelectorAll(".card").forEach(element => {
                        element.classList.add("invisible");
                    })
                }
                if(this.classList.contains("active")){
                    this.classList.remove("active");
                    activeSelections = activeSelections.filter(i => (i !== value));
                    document.querySelectorAll(`.card.category-${value}`).forEach(element => {
                        element.classList.add("invisible");
                    })
                }
                else {
                    this.classList.add("active");
                    activeSelections.push(value);
                    document.querySelectorAll(`.card.category-${value}`).forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
                if (activeSelections.length == 0) {
                    document.querySelectorAll(".card").forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
            })
            document.getElementById("category-select").appendChild(categoryButton);
        }

        document.getElementById("storageReset").addEventListener("click", function() {
            localStorage.removeItem("cardHaveList");
        })
    })
