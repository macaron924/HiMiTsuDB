let cardHaveList = localStorage.getItem("cardHaveList");
cardHaveList = cardHaveList ? JSON.parse(cardHaveList) : {};

let itemHaveList = localStorage.getItem("itemHaveList");
itemHaveList = itemHaveList ? JSON.parse(itemHaveList) : {};

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

        document.getElementById("card_importMode").addEventListener("change", function() {
            let mode = this.value;
            switch (mode) {
                case "compression":
                    document.getElementById("card_management").classList.remove("mode_json");
                    document.getElementById("card_management").classList.add("mode_compression");
                    break;
                case "json":
                    document.getElementById("card_management").classList.remove("mode_compression");
                    document.getElementById("card_management").classList.add("mode_json");
                    break;
            }
        })

        document.getElementById("card_storageImport").addEventListener("click", function() {
            let inputText = document.getElementById("card_dataInput").value;
            try {
                if(isObject(JSON.parse(inputText)) === false) throw "IsNotValidObjectError";
            } catch(error) {
                this.innerText = "インポート失敗。";
                setTimeout(() => {
                    this.innerText = "インポート";
                }, 1000);
                return -1;
            }
            cardHaveList = JSON.parse(inputText);
            localStorage.setItem("cardHaveList", JSON.stringify(cardHaveList));
            this.innerText = "インポート完了。1秒後にリロードします...";
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1000);
        })

        document.getElementById("card_storageExport").addEventListener("click", function() {
            let data = sortHaveJson(cardHaveList);
            document.getElementById("card_dataInput").value = JSON.stringify(data);
        })

        document.getElementById("card_compressionStorageImport").addEventListener("click", function() {
            let inputText = document.getElementById("card_compressionDataInput").value;
            if (inputText.startsWith("card-")) {
                inputText = inputText.replace("card-", "");
            } else {
                this.innerText = "インポート失敗。";
                setTimeout(() => {
                    this.innerText = "インポート";
                }, 1000);
                return -1;
            }
            fetch('data:application/octet-string;base64,' + inputText)
                .then(res => res.blob())
                .then(blobData => {
                    const decompressedStream = blobData.stream().pipeThrough(new DecompressionStream(COMPRESS_MODE));
                    new Response(decompressedStream).text()
                        .then(decompressedText => {
                            try {
                                if(isObject(JSON.parse(decompressedText)) === false) throw "IsNotValidObjectError";
                            } catch(error) {
                                this.innerText = "インポート失敗。";
                                setTimeout(() => {
                                    this.innerText = "インポート";
                                }, 1000);
                                return -1;
                            }
                            cardHaveList = JSON.parse(decompressedText);
                            localStorage.setItem("cardHaveList", JSON.stringify(cardHaveList));
                            this.innerText = "インポート完了。1秒後にリロードします...";
                            setTimeout(() => {
                                window.location.href = window.location.href;
                            }, 1000);
                        })
                })
        })

        document.getElementById("card_compressionStorageExport").addEventListener("click", function() {
            let data = JSON.stringify(sortHaveJson(cardHaveList));
            const dataStream = new Blob([data]).stream();
            const compressedStream = dataStream.pipeThrough(new CompressionStream(COMPRESS_MODE));
            const reader = new FileReader();
            reader.onloadend = () => {
                document.getElementById("card_compressionDataInput").value = `card-${reader.result.replace(/data:.*\/.*;base64,/, '')}`;
            };
            new Response(compressedStream).blob()
                .then(res => reader.readAsDataURL(res));
        })

        document.getElementById("card_storageReset").addEventListener("click", function() {
            var result = confirm('アイプリカードの所持データをリセットします。本当によろしいですか？');
            if (result) {
                localStorage.removeItem("cardHaveList");
                this.innerText = "保存リセット完了。1秒後にリロードします...";
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }
        })
    })

Promise.all([
    fetch("./../data/item_data.json"),
    fetch("./../data/coordinate_data.json")
])
    .then((results) => Promise.all([results[0].json(), results[1].json()]))
    .then((res) => {

        document.getElementById("item_importMode").addEventListener("change", function() {
            let mode = this.value;
            switch (mode) {
                case "compression":
                    document.getElementById("item_management").classList.remove("mode_json");
                    document.getElementById("item_management").classList.add("mode_compression");
                    break;
                case "json":
                    document.getElementById("item_management").classList.remove("mode_compression");
                    document.getElementById("item_management").classList.add("mode_json");
                    break;
            }
        })

        document.getElementById("item_storageImport").addEventListener("click", function() {
            let inputText = document.getElementById("item_dataInput").value;
            try {
                if(isObject(JSON.parse(inputText)) === false) throw "IsNotValidObjectError";
            } catch(error) {
                this.innerText = "インポート失敗。";
                setTimeout(() => {
                    this.innerText = "インポート";
                }, 1000);
                return -1;
            }
            itemHaveList = JSON.parse(inputText);
            localStorage.setItem("itemHaveList", JSON.stringify(itemHaveList));
            this.innerText = "インポート完了。1秒後にリロードします...";
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1000);
        })

        document.getElementById("item_storageExport").addEventListener("click", function() {
            let data = sortHaveJson(itemHaveList);
            document.getElementById("item_dataInput").value = JSON.stringify(data);
        })

        document.getElementById("item_compressionStorageImport").addEventListener("click", function() {
            let inputText = document.getElementById("item_compressionDataInput").value;
            if (inputText.startsWith("item-")) {
                inputText = inputText.replace("item-", "");
            } else {
                this.innerText = "インポート失敗。";
                setTimeout(() => {
                    this.innerText = "インポート";
                }, 1000);
                return -1;
            }
            fetch('data:application/octet-string;base64,' + inputText)
                .then(res => res.blob())
                .then(blobData => {
                    const decompressedStream = blobData.stream().pipeThrough(new DecompressionStream(COMPRESS_MODE));
                    new Response(decompressedStream).text()
                        .then(decompressedText => {
                            try {
                                if(isObject(JSON.parse(decompressedText)) === false) throw "IsNotValidObjectError";
                            } catch(error) {
                                this.innerText = "インポート失敗。";
                                setTimeout(() => {
                                    this.innerText = "インポート";
                                }, 1000);
                                return -1;
                            }
                            itemHaveList = JSON.parse(decompressedText);
                            localStorage.setItem("itemHaveList", JSON.stringify(itemHaveList));
                            this.innerText = "インポート完了。1秒後にリロードします...";
                            setTimeout(() => {
                                window.location.href = window.location.href;
                            }, 1000);
                        })
                })
        })

        document.getElementById("item_compressionStorageExport").addEventListener("click", function() {
            let data = JSON.stringify(sortHaveJson(itemHaveList));
            const dataStream = new Blob([data]).stream();
            const compressedStream = dataStream.pipeThrough(new CompressionStream(COMPRESS_MODE));
            const reader = new FileReader();
            reader.onloadend = () => {
                document.getElementById("item_compressionDataInput").value = `item-${reader.result.replace(/data:.*\/.*;base64,/, '')}`;
            };
            new Response(compressedStream).blob()
                .then(res => reader.readAsDataURL(res));
        })

        document.getElementById("item_storageReset").addEventListener("click", function() {
            var result = confirm('コーデアイテムの所持データをリセットします。本当によろしいですか？');
            if (result) {
                localStorage.removeItem("itemHaveList");
                this.innerText = "保存リセット完了。1秒後にリロードします...";
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }
        })
    })
