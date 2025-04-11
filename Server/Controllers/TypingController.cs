using Microsoft.AspNetCore.Mvc;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class TypingController : ControllerBase{
        private readonly Random _random=new Random();


        [HttpGet("get_text")]
        public ActionResult<String> GetText(){
            List<String> texts=new List<string>();
            texts.Add(new String("Melons, with their vibrant colors and refreshing sweetness, are beloved summer fruits that come in a variety of shapes, sizes, and flavors, making them a popular choice for both snacking and incorporating into desserts, salads, and beverages."));
            texts.Add(new String("The most well-known melon varieties include watermelon, which is known for its high water content and juicy, crisp texture, as well as cantaloupe, which boasts a fragrant aroma and orange flesh, and honeydew, which has a smooth, pale green exterior and a subtly sweet taste."));
            texts.Add(new String("Packed with vitamins A and C, melons are not only delicious but also nutritious, providing a good source of hydration, especially in hot weather, and helping to support skin health and immune function."));
            texts.Add(new String("Watermelons, often enjoyed as a refreshing treat during picnics or barbecues, are made up of about 92% water, making them an ideal snack for staying hydrated, while their deep red or pink flesh contains beneficial antioxidants like lycopene."));
            texts.Add(new String("Although melons are often enjoyed fresh, they can also be preserved by making juices, sorbets, jams, or even dehydrating them into sweet, chewy snacks that can be enjoyed year-round, regardless of the season."));
            texts.Add(new String("Cantaloupes are prized for their rich, orange flesh, which is both sweet and slightly musky, and are often paired with prosciutto or used as a base for smoothies and fruit salads, offering a delicious contrast to other fruits in these dishes."));
            texts.Add(new String("Honeydew melons are known for their smooth, pale green skin and their soft, sweet flesh, which has a mild flavor that pairs wonderfully with fresh mint or as part of a tropical fruit salad with pineapple and mango."));
            texts.Add(new String("While melons are often eaten raw, they can also be used in savory dishes, such as melon and feta cheese salads or grilled melon slices, which bring out the natural sugars in the fruit and add a smoky flavor to complement the sweetness."));
            texts.Add(new String("The seeds of melons, though typically discarded, are actually edible and contain valuable nutrients such as protein, magnesium, and healthy fats, making them a healthy addition when roasted or used in smoothies."));
            texts.Add(new String("Melons thrive in warm climates and are grown on sprawling vines that require plenty of sunlight, well-drained soil, and regular watering, and their cultivation dates back thousands of years, with evidence of melons being cultivated in ancient Egypt and Mesopotamia."));
            texts.Add(new String("Melons, with their rich history of cultivation across the globe, are believed to have originated in Africa and Asia, and today they are grown in a wide variety of climates, from warm, sunny regions to cooler areas with careful cultivation practices."));
            texts.Add(new String("The flesh of watermelon is not only sweet but also provides a significant source of water and electrolytes, making it a perfect hydrating fruit for athletes and those who need to replenish after physical activity or during hot weather."));
            texts.Add(new String("Despite their sweet and indulgent taste, melons are low in calories, making them an excellent choice for those looking to enjoy a healthy, guilt-free snack while still satisfying their craving for something sweet and refreshing."));
            texts.Add(new String("When selecting a melon, it's important to consider its ripeness, as a fully ripe melon will give off a sweet fragrance and yield slightly to pressure, while an underripe melon may have a firm texture and a less pronounced flavor."));
            texts.Add(new String("In addition to their delectable taste, melons offer numerous health benefits, including promoting digestive health thanks to their high fiber content, supporting skin rejuvenation through their vitamin A content, and boosting hydration due to their high water levels."));
            texts.Add(new String("While melons are most commonly consumed raw, they can also be incorporated into a wide variety of dishes, from savory salsas with jalapeños and lime to refreshing sorbets and granitas, offering endless possibilities for both sweet and savory recipes."));
            texts.Add(new String("One unique feature of melons like watermelon is their ability to be enjoyed in both solid and liquid forms, where they can be blended into refreshing juices or pureed for use in cocktails, smoothies, or even frozen treats like popsicles."));
            texts.Add(new String("The use of melons in traditional remedies and folk medicine can be traced back to ancient cultures, where they were believed to have cooling properties and were often recommended to ease heatstroke, fevers, or digestive issues due to their high water content and soothing effects."));
            texts.Add(new String("Melon rinds, often discarded, can actually be used in a variety of creative ways, including pickling or making preserves, offering a unique, tangy flavor that can add an interesting twist to savory dishes or even be turned into chutneys or relishes."));
            texts.Add(new String("Growing melons requires a delicate balance of warm temperatures, rich soil, and sufficient space for the vines to spread out, and in some regions, they are even grown vertically using special trellises to optimize space and promote healthier fruit production."));
            String text=texts.ElementAt(_random.Next()%3);
            return Ok(text);
        }
    }
}