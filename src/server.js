const got = require('got')


const bt = got.extend({
    baseUrl: "http://api.rp.bt.com/sensors/feeds",
    json: true,
    headers: {
        'x-api-key': '3c3a7b2c-cfa7-4535-95f4-627183bc4e03'
    }
})

function publishToBroker(body){
    console.log(body)
    //got.post("http://34.244.86.232:1026/v2/op/update?options=keyValues", {body})
}

async function getDataFromProvider(feedID, dataProvider){
    try{
        return (await dataProvider(feedID)).body
    }catch(err){
        console.error(err)
    }
}


function transformData(data){
    return data;
}



function main(){
    //In milliseconds
    console.log("Starting")
    let timer = 500
    let feedID = dataSources[0];
    return setInterval(async ()=>{
        try{
            const data = await getDataFromProvider(feedID, bt);
            const transformedData = transformData(data);
            publishToBroker(transformedData);
        }catch(err){
            console.error(err);
        }
    }, timer
    )
}

let dataSources = [
    "b669e529-f894-49ee-b73a-9877cbd87067",
    "b7b8ee4d-3814-4ffb-bceb-20efdfe4eb44",
    "e36df53b-7d36-48fe-928d-cf15d6ad214e",
    "d00e5ef9-6fe4-41b5-abb9-9c9fb3cc22da",
    "31bd8b40-57a8-49df-b569-5fb33a8dc4d7",
    "f29ca8ab-73de-48d1-b404-bceeb116d5c5",
    "6a55a4b3-1a25-4d47-b1b0-7996022d681d",
    "bb79672f-d9e9-4e28-b903-ea3f2161d7c2",
    "20f9c8ed-8d27-4a30-9b0c-52b4369c3099",
    "b98ff8cc-3a31-4f2f-ad1f-1835864cde1a",
    "4e7ed214-b401-40b8-892c-f4a6937a56ea",
    "7b4b9caf-38de-46b6-a440-52651b29116e",
    "f6e78387-a513-4bb9-8b48-4fa079b703c7",
    "6df6fc6e-7563-40d6-93e9-8c80f6bf95e1",
    "73fa6cd6-d16d-45d4-a282-8dc6d8e3c394",
    "8cc95348-085b-46c5-9f4f-de6f3da13703",
    "6d74fa26-4d9b-4e5d-ab55-5950e81acffb",
    "94660d6d-615a-4b2b-9d1d-79bf0eead6d0",
    "11a5b230-eb3a-41ee-b6db-20fa7f066abe",
    "6c0f75c2-3fe3-4c6f-956f-f815b4e6356c",
    "3fbb77e5-febc-460c-90df-9206e3bfabd6",
    "75e6ff29-2b82-48a6-927e-1741f5e2ad2e",
    "785ba051-fd80-4fa7-8773-3e81f618f97c",
    "4805f62e-0c28-4629-b96d-a94ba32ea992",
    "a4eefd03-845b-4ddb-8a68-8c2f6b3d68b8",
    "ff3e4dd9-8ae2-49d3-aa05-8eb77a67a569",
    "a3ab39fd-b7de-4885-8762-f62d2720da10",
    "6d568cfb-dfd4-4701-b34d-31026cc54bb9",
    "7cc54a11-9594-464a-980b-92a040dc38c0",
    "cef998f4-7d71-4813-a771-c4ccf53b2cc0",
    "0ec081a0-25ac-4197-90c1-0a89fab893aa",
    "d911a880-b325-42f6-bcf8-4032749c4460",
    "3fced92e-9218-4046-bb28-d8f74af51ecf",
    "b4902d1b-0fe4-46fd-b335-063ba438fbb3",
    "fb9a5daf-f09b-411d-b9b8-e43237eaa19a",
    "9dfe3d7a-77d3-411f-8a20-c8724d0d2e96",
    "6b019042-5035-4b88-8314-6e12c2d62552",
    "6f1142a5-a481-4684-88da-8a4eb7643217",
    "5d6f10cd-3b5e-4512-9816-95acbe21599c",
    "3e3a83e1-79dc-4b4d-824a-09a471e90c3e",
    "e8de993b-1d97-452b-84c9-ea70bfa05afd",
    "49538deb-fe33-425b-8d8c-3fa3a052b7fe",
    "f05b015c-41c0-41a5-b978-eddaaf599059",
    "3330a6e6-e8f5-4455-b6ac-f00231d2cc92",
    "4708d1e8-bb3c-476b-be79-729b96c9244b",
    "8ce512c6-0866-4131-8ded-9d3131bf1f07",
    "cca40a61-588f-4e99-a9dc-c61ee3679881",
    "c0ab2539-d649-46b7-b784-a6f54d07306c",
    "0812da07-a1e5-42ed-aa0b-8ee670fa920b",
    "bdc8abd0-7b81-4949-a563-102129e75192",
    "9cdaef44-0822-4977-8e6a-09c042c51acf",
    "af9ea352-ef67-4a8a-8565-0c099c51b127",
    "7f80d25e-d823-4203-ad40-17313503cc18",
    "4d7321f9-0651-480c-9984-596096b7a266",
    "4274b0b8-6fb7-4b5f-abb1-a5e62da1678f",
    "258f8141-fb28-4173-92b5-39e687bac6d0",
    "ba73a7cc-400c-467a-ae6e-26864d017f56",
    "458c2925-7c84-4a1b-bfc8-a778a3f10b4e",
    "44c834b6-cc3e-439e-841f-a8a2e60a36b6",
    "8fe6d8e6-cafd-4a17-bb68-56ec3fbdc7a6",
    "0159ab58-0cf5-4c83-bad2-1ca138465277",
    "c4f33eab-8e64-4c1b-8a2e-1e71b854525e",
    "86a25d4e-25fc-4ebf-a00d-0a603858c7e1",
    "b0f1a176-c817-478f-9a4b-ab23f7d9a296",
    "4152be42-c0f3-41a6-86a6-a92d5da9c15d",
    "c3b1bdcc-1d0f-4aba-bf96-0db3c3f7271d",
    "a0ff5518-7bfa-4450-95f2-e4159c4886fc",
    "e7e42202-221c-4d4e-906c-9ef48fd45ec6",
    "cc7c8a4b-cc8d-4497-b5a5-30778391320d",
    "5b2123b5-6a01-4a37-bc05-3e93ce14eb92"];

module.exports = main;



