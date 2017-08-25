const loadAllItems = require("../src/items.js");
const loadPromotions = require("../src/promotions.js");


function sumItems(allitems, inputs) {
  let Items = [];
  inputs.forEach(i => {
    let itemBac = i.split(" x ")[0];
    let itemCount = parseInt(i.split(" x ")[1]);
    allitems.forEach(it => {
      if (it.id === itemBac) {
        Items.push({
          id: itemBac,
          name: it.name,
          count: itemCount,
          price: it.price
        });
      }
    });
  });
  return Items;
}

function sumPromotions(items, promotions) {
  let discount = {};
  let sum = 0;
  let planA = 0, planB = 0;
  let list = [];

  items.forEach(item => {
    sum += item.price * item.count;
    if (promotions[1].items.includes(item.id)) {
      planB += parseInt(item.price * item.count / 2);
      list.push(item.name);
    }
  });
  if (sum > 30) {
    planA = parseInt(sum / 30) * 6;
  }
  if (planA == planB && planB == 0) {
    discount = {
      type: 'none',
      name: '',
      save: 0
    };
    return discount;
  }

  if (planA >= planB) {
    discount = {
      type: "满30减6",
      name: "",
      save: planA
    };
  } else if (planA < planB) {
    discount = {
      type: "指定半价",
      name: list,
      save: planB
    };
  }
  return discount;
}

function makeInventory(items, discount) {
  let allSum = 0;
  let result;
  let str = "============= 订餐明细 =============\n";
  items.forEach(item => {
    str += item.name + " x " + item.count + " = " + item.price * item.count + "元\n";
    allSum += item.count * item.price;
  });
  if (discount.type === "none") {
    result = str + "-----------------------------------\n" + "总计：" + allSum + "元\n" + "===================================";
    return result;
  }
  if (discount.type === "满30减6") {
    result = str + "-----------------------------------\n" + "使用优惠:\n" + "满30减6元，省" + discount.save + "元\n" + "-----------------------------------\n" + "总计：" + (allSum - discount.save) + "元\n" + "===================================";
    return result;
  }
  if (discount.type === "指定半价") {
    result = str + "-----------------------------------\n" + "使用优惠:\n" + "指定菜品半价(" + discount.name.join("，") + ")，省" + discount.save + "元\n" + "-----------------------------------\n" + "总计：" + (allSum - discount.save) + "元\n" + "===================================";
    return result;
  }
}

module.exports = function bestCharge(inputs) {
  let allitems = loadAllItems();
  let promotions = loadPromotions();
  let items = sumItems(allitems, inputs);
  let discount = sumPromotions(items, promotions);
  let result = makeInventory(items, discount);
  console.log(result);
  return result;
};
