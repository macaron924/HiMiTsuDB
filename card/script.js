let categoryList = [];
let activeSelections = [];

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

            //div.innerText = `${obj.brandName} / ${obj.character} / ${obj.cardName}`;
            document.getElementById("content").appendChild(div);
        })

        for (let i in categoryList) {
            const categoryButton = document.createElement("button");
            categoryButton.value = categoryList[i];
            categoryButton.innerHTML = categoryList[i];
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
    })
