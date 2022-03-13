
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tips').del()
    .then(function () {
      // Inserts seed entries
      return knex('tips').insert([
        {
            user_id: '271003111236042753',
            text: "Don't split the party."
        },
        {
            user_id: '271003111236042753',
            text: "Remember to have fun."
        },
        {
            user_id: '271003111236042753',
            text: "Keep track of your spell slots."
        },
        {
            user_id: '271003111236042753',
            text: "Hit dice are mostly used to recover health during a short rest. You can use one for each level you have gained, and they reset after a long rest."
        },
        {
            user_id: '271003111236042753',
            text: "There is no \"double advantage\". You have advantage or you don't. You have disadvantage or you don't. If you have both, they cancel each other out."
        },
        {
            user_id: '271003111236042753',
            text: "Warlocks, Monks, and Fighters enjoy short rests. A lot."
        },
        {
            user_id: '271003111236042753',
            text: "Dexterity, Wisdom, and Constitution saves are common. Strength, Intelligence, and Charisma saves are... less so."
        },
        {
            user_id: '271003111236042753',
            text: "Be sure to ask every NPC you meet for their full name. Quiz your Dungeon Master on the names later, and if they forget one, complain loudly that their sloppy continuity is breaking your immersion."
        },
        {
            user_id: '271003111236042753',
            text: "Death saves count as saving throws."
        },
        {
            user_id: '271003111236042753',
            text: "Inspiration and Bardic Inspiration are two separate things that are used in very different ways. They just happen to be named similarly. It feels like an oversight."
        },
        {
            user_id: '271003111236042753',
            text: "You can never have too many dice."
        },
        {
            user_id: '271003111236042753',
            text: "Miniature painting is a noble calling."
        },
        {
            user_id: '271003111236042753',
            text: "If an acquaintance of yours seems uninterested in Dungeons and Dragons, they probably are just lacking the proper context. Spend at least 30 minutes explaining your character's backstory and detailing the most clever thing you have done in game."
        },
        {
            user_id: '271003111236042753',
            text: "Fudging dice rolls is a sin, and Bahamut is always watching... even when your Dungeon Master is distracted."
        },
        {
            user_id: '271003111236042753',
            text: "Don't eat yellow snow."
        },
        {
            user_id: '271003111236042753',
            text: "There is no \"best\" class in Dungeons and Dragons. There is, however, a \"worst\" class: Beast Master Rangers. Sorry, Beast Masters."
        },
        {
            user_id: '271003111236042753',
            text: "If you gain one level from every class, you ascend to a higher plane of existence."
        },
        {
            user_id: '271003111236042753',
            text: "Unlike in many video games, strafing offers no tactical benefit nor speed boost in Dungeons and Dragons."
        },
        {
            user_id: '271003111236042753',
            text: "Trust no one. When you encounter a new NPC, assume the Dungeon Master has placed them into this world to deceive and betray you. Betray them first, and you may gain a surprise round in combat!"
        },
        {
            user_id: '271003111236042753',
            text: "Accents are actually very hard to do and it's important to remember that your Dungeon Master is a person with feelings who is trying very hard."
        },
        {
            user_id: '271003111236042753',
            text: "Repeatedly in a grapple, a character needs to make opposed grapple checks against an opponent. A grapple check is something like a melee attack roll, determined by the equation: base attack bonus + strength modifier + special size modifier. See the attached chart to determine your side m... oh wait, this is Fifth Edition? Thank god. Never mind."
        }
      ]);
    });
};
