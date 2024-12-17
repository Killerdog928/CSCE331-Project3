"use server";

import { Transaction, WhereOptions } from "sequelize";

import {
  Employee,
  Item,
  ItemFeature,
  JobPosition,
  Order,
  RecentOrder,
  Sellable,
  SellableCategory,
  SellableComponent,
} from "@/db";
import { bulkCreateOrders } from "@/server/backend/Order";
import {
  ItemJson,
  OrderCreationAttributes,
  parseEmployee,
  parseItem,
  parseSellable,
  parseSellableCategory,
  SellableCategoryJson,
  SellableJson,
  SoldItemCreationAttributes,
} from "@/server/db";

const numOrders = 10000;
const numRecentOrders = 50;

type Option<T> = {
  p?: number;
  t: T;
};

/**
 * Generates a range of numbers from `from` to `to`.
 * @param {number} from - The start of the range.
 * @param {number} to - The end of the range.
 * @returns {Generator<number>}
 */
function* range(from: number, to: number) {
  while (from < to) yield from++;
}

/**
 * Generates a random number between `a` and `b`.
 * @param {number} a - The lower bound.
 * @param {number} b - The upper bound.
 * @returns {number}
 */
function uniform(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

/**
 * Selects a random element from an array.
 * @param {T[]} options - The array of options.
 * @returns {T}
 */
function select<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Chooses an option based on probabilities.
 * @param {Option<T>[]} options - The array of options with probabilities.
 * @returns {T}
 */
function choose<T>(options: Option<T>[]): T {
  let p = Math.random();

  for (const option of options) {
    if (!option.p || p < option.p) {
      return option.t;
    }
    if (option.p) {
      p -= option.p;
    }
  }

  return options[options.length - 1].t;
}

/**
 * Gets the opening and closing hours for a given date.
 * @param {Date} date - The date to get hours for.
 * @returns {{ open: Date; close: Date } | null}
 */
function getHours(date: Date): { open: Date; close: Date } | null {
  const day = date.getDay();

  if (day === 0) {
    // Closed on Sunday
    return null;
  }

  const [openTime, closeTime] =
    day === 5 // Friday
      ? [
          [10, 30],
          [22, 30],
        ]
      : day === 6 // Saturday
        ? [
            [10, 30],
            [20, 0],
          ]
        : [
            [10, 30],
            [22, 0],
          ];

  const open = new Date(date);

  open.setHours(openTime[0], openTime[1], 0, 0);
  const close = new Date(date);

  close.setHours(closeTime[0], closeTime[1], 0, 0);

  return { open, close };
}

/**
 * Generates a random date between `start` and `end` within business hours.
 * @param {Date} start - The start date.
 * @param {Date} end - The end date.
 * @returns {Date}
 */
function randomDate(start: Date, end: Date): Date {
  let date = new Date(uniform(start.getTime(), end.getTime()));
  let hours = getHours(date);

  while (!hours) {
    date = new Date(uniform(start.getTime(), end.getTime()));
    hours = getHours(date);
  }

  return new Date(uniform(hours.open.getTime(), hours.close.getTime()));
}

const combos: Option<WhereOptions<SellableCategory>[]>[] = [
  {
    p: 0.4,
    t: [{ name: "Meal" }],
  },
  {
    p: 0.2,
    t: [{ name: "Meal" }, { name: "Drink" }],
  },
  {
    p: 0.2,
    t: [{ name: "Meal" }, { name: "Appetizer" }],
  },
  {
    p: 0.1,
    t: [{ name: "Meal" }, { name: "Drink" }, { name: "Appetizer" }],
  },
  {
    p: 0.075,
    t: [{ name: "Meal" }, { name: "A la Carte" }],
  },
  {
    p: 0.025,
    t: [{ name: "Kids Meal" }],
  },
];

const sellables: Map<string, Option<WhereOptions<Sellable>>[]> = new Map([
  [
    "Meal",
    [
      {
        p: 0.4,
        t: { name: "Bowl" },
      },
      {
        p: 0.3,
        t: { name: "Plate" },
      },
      {
        p: 0.2,
        t: { name: "Bigger Plate" },
      },
      {
        p: 0.1,
        t: { name: "Family Meal" },
      },
    ],
  ],
  [
    "Drink",
    [
      {
        p: 1.0,
        t: { name: "Drink" },
      },
    ],
  ],
  [
    "Appetizer",
    [
      {
        p: 1.0,
        t: { name: "Appetizer" },
      },
    ],
  ],
  [
    "A la Carte",
    [
      {
        p: 0.2,
        t: { name: "Small A La Carte Entree" },
      },
      {
        p: 0.2,
        t: { name: "Medium A La Carte Entree" },
      },
      {
        p: 0.2,
        t: { name: "Large A La Carte Entree" },
      },
      {
        p: 0.2,
        t: { name: "Small A La Carte Side" },
      },
      {
        p: 0.2,
        t: { name: "Medium A La Carte Side" },
      },
    ],
  ],
  [
    "Kids Meal",
    [
      {
        p: 1.0,
        t: { name: "Kids Meal" },
      },
    ],
  ],
]);

const items: Map<string, Option<WhereOptions<Item>>[]> = new Map([
  [
    "Entree",
    [
      {
        p: 0.4,
        t: { name: "Orange Chicken" },
      },
      {
        p: 0.6,
        t: {},
      },
    ],
  ],
  [
    "Side",
    [
      {
        p: 0.4,
        t: { name: "Fried Rice" },
      },
      {
        p: 0.3,
        t: { name: "Chow Mein" },
      },
      {
        p: 0.3,
        t: {},
      },
    ],
  ],
  [
    "Appetizer",
    [
      {
        p: 0.3,
        t: { name: "Cream Cheese Rangoon" },
      },
      {
        p: 0.3,
        t: { name: "Chicken Egg Roll" },
      },
      {
        p: 0.2,
        t: { name: "Vegetable Spring Roll" },
      },
      {
        p: 0.2,
        t: {},
      },
    ],
  ],
  [
    "Drink",
    [
      {
        p: 0.3,
        t: { name: "Bottled Water" },
      },
      {
        p: 0.2,
        t: { name: "Small Drink" },
      },
      {
        p: 0.2,
        t: { name: "Medium Drink" },
      },
      {
        p: 0.2,
        t: { name: "Large Drink" },
      },
    ],
  ],
]);

const customerNames: string[] = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Elizabeth",
  "William",
  "Linda",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Charles",
  "Sarah",
  "Thomas",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Betty",
  "Matthew",
  "Helen",
  "Anthony",
  "Sandra",
  "Mark",
  "Ashley",
  "Donald",
  "Dorothy",
  "Steven",
  "Kimberly",
  "Paul",
  "Shirley",
  "Andrew",
  "Cynthia",
  "Joshua",
  "Ruth",
  "Kenneth",
  "Angela",
  "Kevin",
  "Deborah",
  "Brian",
  "Betty",
  "George",
  "Megan",
  "Edward",
  "Hannah",
  "Timothy",
  "Rachel",
  "Jason",
  "Amy",
  "Jeffrey",
  "Laura",
  "Ryan",
  "Carol",
  "Gary",
  "Marilyn",
  "Nicholas",
  "Frances",
  "Eric",
  "Evelyn",
  "Jacob",
  "Cheryl",
  "Steven",
  "Brenda",
  "Sean",
  "Alice",
  "Adam",
  "Judy",
  "Jack",
  "Shawn",
  "Anna",
  "Brian",
  "Tina",
  "Scott",
  "Danielle",
  "Louis",
  "Heather",
  "Frank",
  "Grace",
  "Larry",
  "Michelle",
  "Raymond",
  "Kim",
  "Billy",
  "Jessica",
  "Ethan",
  "Natalie",
  "Samuel",
  "Debbie",
  "Victor",
  "Ruby",
  "Leo",
  "Shannon",
  "Luke",
  "Kimberley",
  "Jacob",
  "Catherine",
  "Zachary",
  "Monica",
  "Brian",
  "Kayla",
  "Alexander",
  "Sophia",
  "Nathan",
  "Julia",
  "Henry",
  "Lily",
  "Arthur",
  "Ava",
  "Tim",
  "Jasmine",
  "Samuel",
  "Grace",
  "Peter",
  "Sarah",
  "Daniel",
  "Clara",
  "Thomas",
  "Maggie",
  "Charles",
  "Emma",
  "Johnny",
  "Victoria",
  "Dennis",
  "Nancy",
  "David",
  "Rebecca",
  "Carl",
  "Brittany",
  "Steven",
  "Denise",
  "Harold",
  "Susan",
  "Stanley",
  "Beverly",
  "Dennis",
  "Isabella",
  "Clyde",
  "Eva",
  "Allen",
  "Sadie",
  "Joshua",
  "Beth",
  "Megan",
  "Alice",
  "Wendy",
  "Dean",
  "Laura",
  "Jesse",
  "Helen",
  "Charlie",
  "Frances",
  "Darlene",
  "Brian",
  "Joan",
  "Eddie",
  "Valerie",
  "Paula",
  "Brian",
  "Angela",
  "Judy",
  "Mark",
  "Julie",
  "Craig",
  "Tracy",
  "Stan",
  "Tammy",
  "Dennis",
  "Shirley",
  "Doris",
  "Paul",
  "Lori",
  "Gregory",
  "Vera",
  "Lillian",
  "George",
  "Janet",
  "Stephen",
  "Carmen",
  "Jack",
  "Charlotte",
  "Douglas",
  "Gail",
  "Andrew",
  "Hannah",
  "Ronald",
  "Faye",
  "Michele",
  "Marissa",
  "Lori",
  "Carla",
  "Victor",
  "Jean",
  "Gina",
  "Benny",
  "Cindy",
  "Maurice",
  "Kathy",
  "Vicki",
  "Ray",
  "Michele",
  "Linda",
  "Alyssa",
  "Freddie",
  "Amelia",
  "Howard",
  "Nancy",
  "Cynthia",
  "Carson",
  "Nancy",
  "Bruce",
  "Susan",
  "Sharon",
  "Sandra",
  "Stella",
  "Juliana",
  "Diane",
  "Helen",
  "Angela",
  "Miriam",
  "Lydia",
  "Corey",
  "Sandy",
  "Timothy",
  "Craig",
  "Beverly",
  "Gerald",
  "Gloria",
  "Terry",
  "Carolyn",
  "Nancy",
  "Gregory",
  "Peter",
  "Virginia",
  "Kristin",
  "James",
  "Barbara",
  "Betty",
  "Lauren",
  "Albert",
  "Beverly",
  "George",
  "Edith",
  "Patricia",
  "Chad",
  "Shannon",
  "Josephine",
  "Emma",
  "Olivia",
  "Max",
  "Jay",
  "Terry",
  "Natalie",
  "Caleb",
  "Paige",
  "Shannon",
  "Paul",
  "Krista",
  "Becky",
  "Melanie",
  "Michelle",
  "Felicia",
  "Oscar",
  "Daniel",
  "Grace",
  "Chris",
  "Matthew",
  "Emily",
  "Ruth",
  "Patrick",
  "Johnny",
  "Ellen",
  "Jerry",
  "Maggie",
  "Riley",
  "Sylvia",
  "Samantha",
  "Sean",
  "Tyler",
  "Megan",
  "Katie",
  "Nicole",
  "Lisa",
  "David",
  "Sharon",
  "Cory",
  "Dan",
  "Lillian",
  "April",
  "Arthur",
  "Aaron",
  "Vera",
  "Erica",
  "Kathleen",
  "Dale",
  "Holly",
  "Nina",
  "Ed",
  "Helen",
  "Warren",
  "Sam",
  "Darlene",
  "Clifford",
  "Laura",
  "Rachel",
  "Jodie",
  "Emily",
  "John",
  "Marie",
  "Theresa",
  "Raymond",
  "Donald",
  "Walter",
  "Megan",
  "Grace",
  "Sandy",
  "Donna",
  "Jason",
  "Elaine",
  "Raymond",
  "Sarah",
  "Harold",
  "Julie",
  "Maggie",
  "Alex",
  "Lana",
  "Kara",
  "Sandy",
  "Beryl",
  "Max",
  "Walter",
  "Stacy",
  "Alice",
  "Tom",
  "George",
  "Sandy",
  "Edith",
  "Nancy",
  "Katie",
  "Rebecca",
  "Henry",
  "Nicole",
  "Maxine",
  "Jan",
  "Marie",
  "Earl",
  "Stephanie",
  "Dora",
  "Sue",
  "Alfred",
  "Ron",
  "Jill",
  "Harold",
  "Nina",
  "Roberta",
  "Dennis",
  "Clara",
  "Jody",
  "Ava",
  "Doris",
  "Beverly",
  "Linda",
  "Jesse",
  "Dylan",
  "Jenna",
  "Sally",
  "Aiden",
  "Sue",
  "Tracy",
  "George",
  "Kristen",
  "Roxanne",
  "Freddie",
  "Bradley",
  "Vickie",
  "Brenda",
  "Wayne",
  "Sandy",
  "Sherry",
  "Thomas",
  "Leah",
  "Jason",
  "Kathy",
  "Carlos",
  "Wendy",
  "Daisy",
  "Vickie",
  "Stephanie",
  "Nancy",
  "Carol",
  "Lynne",
  "Gail",
  "Jerry",
  "Keith",
  "Catherine",
  "Tina",
  "Vera",
  "Lorraine",
  "Louis",
  "Beatrice",
  "Nicole",
  "Nancy",
  "Shane",
  "Helen",
  "Diane",
  "Barry",
  "Virginia",
  "Gene",
  "Elise",
  "Marie",
  "Clinton",
  "Cheryl",
  "Dean",
  "Jenna",
  "Albert",
  "Howard",
  "Ernie",
  "Tony",
  "Jade",
  "Alfred",
  "Betty",
  "Brenda",
  "Grace",
];

/**
 * Generates orders and populates the database.
 * @param {Transaction} transaction - The database transaction.
 * @returns {Promise<Order[]>}
 */
export async function generateOrders(
  transaction: Transaction,
): Promise<Order[]> {
  const now = new Date();
  let [startDate, yesterday, today] = [now, now, now].map((d) => new Date(d));

  startDate.setFullYear(now.getFullYear() - 2);
  let startDateHours = getHours(startDate);

  while (!startDateHours) {
    startDate.setDate(startDate.getDate() - 1);
    startDateHours = getHours(startDate);
  }

  yesterday.setDate(now.getDate() - 1);
  let yesterdayHours = getHours(yesterday);

  while (!yesterdayHours) {
    yesterday.setDate(yesterday.getDate() - 1);
    yesterdayHours = getHours(yesterday);
  }

  const todayHours = getHours(today);

  const pSellableCategories = Promise.all(
    combos.map(
      async ({ t, ...opt }) =>
        ({
          t: await Promise.all(
            t.map((scInfo) =>
              SellableCategory.findAll({
                where: scInfo,
                transaction,
              }).then((scs) => Promise.all(scs.map(parseSellableCategory))),
            ),
          ),
          ...opt,
        }) as Option<SellableCategoryJson[][]>,
    ),
  );
  const pSellables = Promise.all(
    Array.from(sellables.entries()).map(
      async ([k, v]) =>
        [
          k,
          await Promise.all(
            v.map(async ({ t, ...opt }) => ({
              t: await Sellable.findAll({
                include: [
                  {
                    model: SellableComponent,
                    include: [
                      {
                        model: ItemFeature,
                      },
                    ],
                  },
                ],
                where: t,
                transaction,
              }).then((ss) => Promise.all(ss.map(parseSellable))),
              ...opt,
            })),
          ),
        ] as [string, Option<SellableJson[]>[]],
    ),
  ).then((ss) => new Map(ss));
  const pItems = Promise.all(
    Array.from(items.entries()).map(
      async ([k, v]) =>
        [
          k,
          await Promise.all(
            v.map(
              async ({ t, ...opt }) =>
                ({
                  t: await Item.findAll({
                    attributes: ["id"],
                    where: t,
                    transaction,
                  }).then((is) => Promise.all(is.map(parseItem))),
                  ...opt,
                }) as Option<ItemJson[]>,
            ),
          ),
        ] as [string, Option<ItemJson[]>[]],
    ),
  ).then((ss) => new Map(ss));
  const pEmployees = Employee.findAll({
    include: {
      model: JobPosition,
      where: {
        // TODO: filter by access
      },
    },
    transaction,
  }).then((es) => Promise.all(es.map(parseEmployee)));

  const [scs, ss, _is, es] = await Promise.all([
    pSellableCategories,
    pSellables,
    pItems,
    pEmployees,
  ]);

  /**
   * Generates a single order.
   * @param {Date} orderDate - The date of the order.
   * @returns {OrderCreationAttributes}
   */
  const generateOrder = (orderDate: Date) => {
    const customerName = select(customerNames);
    const employee = select(es);

    const comboSellableCategories = choose(scs).map(select);
    const comboSellables = comboSellableCategories.map(({ name }) =>
      select(choose(ss.get(name)!)),
    );
    const comboSoldItems: SoldItemCreationAttributes[][] = comboSellables.map(
      () => [],
    );
    //   ({ SellableComponents }) =>
    //   SellableComponents
    //     ? SellableComponents!.map(({ amount, ItemFeature: ifInfo }) => {
    //         const item = select(choose(is.get(ifInfo!.name)!));
    //         return {
    //           amount,
    //           Item: item,
    //           ItemId: item.id,
    //         } as SoldItemCreationAttributes;
    //       })
    //     : [],
    // );

    const additionalPrices = comboSoldItems.map((soldItems) =>
      soldItems.reduce(
        (sum, { amount, Item: iInfo }) =>
          sum + (amount || 1) * ((iInfo as ItemJson)?.additionalPrice || 0),
        0,
      ),
    );
    const totalPrice = comboSellables.reduce(
      (sum, { price }, i) => sum + price, // + additionalPrices[i],
      0,
    );

    return {
      customerName,
      totalPrice,

      orderDate,

      EmployeeId: employee.id,

      SoldSellables: comboSellables.map((s, i) => ({
        SoldItems: comboSoldItems[i],
        SellableId: s.id,
      })),
    } as OrderCreationAttributes;
  };

  const oldOrderInfos = Array.from(range(0, numOrders)).map(() =>
    generateOrder(randomDate(startDateHours!.open, yesterdayHours!.close)),
  );

  const recentOrderInfos = todayHours
    ? Array.from(range(0, numRecentOrders)).map(() => ({
        ...generateOrder(randomDate(todayHours.open, todayHours.close)),
        RecentOrder: {
          orderStatus: RecentOrder.Status.COMPLETED,
        },
      }))
    : [];

  return await bulkCreateOrders([...oldOrderInfos, ...recentOrderInfos], {
    transaction,
  });
}
