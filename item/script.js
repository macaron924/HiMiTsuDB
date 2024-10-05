fetch("./../data/item_data.json")
    .then((r) => r.json())
    .then((res) => {
        res.forEach((obj) => {
            const div = document.createElement("div");
            switch (obj.part) {
                case "トップス":
                    div.className = "item type-tops";
                    break;
                case "ボトムス":
                    div.className = "item type-bottoms";
                    break;
                case "シューズ":
                    div.className = "item type-shoes";
                    break;
                case "アクセ":
                    div.className = "item type-accessory";
                    break;
                default:
                    div.className = "item";
            }

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

            //div.innerText = `${obj.brandName} / ${obj.coordinateName} / ${obj.part}`;
            document.getElementById("content").appendChild(div);
        })
    })
