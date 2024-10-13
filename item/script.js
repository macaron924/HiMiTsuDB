let categoryList = [];
let activeSelections = [];

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
            if (obj.re == true) {
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

            //div.innerText = `${obj.brandName} / ${obj.coordinateName} / ${obj.part}`;
            document.getElementById("content").appendChild(div);
        })

        for (let i in categoryList) {
            const categoryButton = document.createElement("button");
            categoryButton.value = categoryList[i];
            categoryButton.innerHTML = categoryList[i];
            categoryButton.addEventListener("click", function() {
                let value = this.value;
                if (activeSelections.length == 0) {
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
                if (activeSelections.length == 0) {
                    document.querySelectorAll(".item").forEach(element => {
                        element.classList.remove("invisible");
                    })
                }
            })
            document.getElementById("category-select").appendChild(categoryButton);
        }
    })
