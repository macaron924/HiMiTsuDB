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

            //div.innerText = `${obj.brandName} / ${obj.character} / ${obj.cardName}`;
            document.getElementById("content").appendChild(div);
        })
    })
