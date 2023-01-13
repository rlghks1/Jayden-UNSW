<Assumptions>

1. Character
    
    * Base Health: 100hp
    * Basic Attack Damage: 10
    * Basic Defense: 0
    * Maximum number of allied soldiers: 5
    * Attack phase: character attacks first, then enemies and allies.

    * We assume that the character proceeds through the game in the order of do attack phase then building interactions.
    * After a turn of attacks, if enemies are defeated relevant items/cards will be dropped.
    * We assume that the character and allied soldiers can attack any enemies in the battle radius.
    * Character will move 1 step clockwise around the path after all attacking enemies are defeated an all interactions with buildings are complete.

#

2. Enemies
    
    2.1 Slug 
    * Base HP : 10
    * enemy damage : 1
    * attack radius: 1 grid
    * support radius: 1 grid

    * We assume that a slug randomly spawns two each time the player completes a cycle of the path.

    2.2 Zombie 
    * Base HP : 30
    * enemy damage : 3
    * attack radius: 2 grid
    * support radius: 2 grid
    * critical attack chance: 10% - 6 (doubled damage) 

    * We assume that the probability of a critical bite of a zombie is 10%.
    * A zombie transformed from an allied soldier has its initial health(full stamina).

    2.3 Vampire 
    * Base HP : 50
    * enemy damage : 5
    * attack radius: 3 grids
    * support radius: 5 grids
    * critical attack chance: 5% - 10 (doubled damage)
    * additional critical damage: 3% - 10 (doubled damage)
    * random additional number of attacks: 2~5

    * We assume that there can be only one enemy per tile.
    * We assume that when a character attacks a vampire with ‘stake’, the damage
is doubled.
    * We assume that the probability of an occurrence of a critical bite is 5% and
the damage of the bite is 10. And also, when a critical bite was occured by a vampire, the number of attacks is between 2 and 5.

#

3. Buildings
    * We assume that there can be only one building per tile.
    * All types of buildings can be built up to 10 each.
    * Assume that vampireCastle and Zombie Pit will only spawn an enemy in the positions that are adjacent to it and only if there is no enemy there.

    3.1. Village
    * We assume that when the character passes through a village, it regains health by 20.

    3.2. Trap
    * Damage : TBD
    * Only deals damage to one enemy.

    3.3. Campfire
    * Range: 1

    3.4. Tower
    * Damge: TBD
    * Range: 3

#

4. Basic Items
    
    * We assume that the character can only have up to 16 unequipped items.
    * We assume that the character has a 50% chance to get an item when it kills an enemy.
    * We assume that when we get a new item and the the unequipped item inventory is full, the character discard the oldest item and get 50 gold and 100 experience points.

    4.1 Weapons
    
    1) Sword
        * price : standard: 400 gold / berserker: 600 gold
        * damage : 6
        * attack range : 2

    2) Stake
        * price : standard: 500 gold / berserker: 750 gold
        * damage : 4(8 against vamprie)
        * attack range : 1
        
    3) Staff
        
        * damage : 3
        * price : standard: 500 gold / berserker: 750 gold
        * attack range : 2
        * trance : 7% probability
        * We assume that staff has a 7% chance to inflict a ‘trance’ and the changed allied soldier lasts 25 seconds in the changed state.
        * Allied soldiers transformed from enemies have their initial health(full stamina).
        * We assume that if the soldier has changed to enemy and returns to his original form(didn’t die from a battle), then it has the stamina which was the most recent stamina before shape change.
        
    * We assume that the character can only put one weapon on.

#       

    4.2 Armours
        
    * We assume that the character can only put one piece of armour, shield, helmet on.
    * We assume that if the character wears an armour and a helmet, 
    then damage of the total percent of armour and helmet (20+50=70%) will be reduced.

    1) Armour
        * price : standard: 300 gold / berserker: 450 gold
        * defense : 50%
        
    2) Shield
        
        * We assume that when the character is equipped with a shield, only 80% of the total damage except shield effect is taken.
            (e.g) a slug attacks the character wearing an armour, a shield and a helmet 
                -> total damage = (1 * (1 - (0.5+0.2)) * 0.8 = 0.24)
        
        
    3) Helmet 
        * price : standard: 600 gold / berserker: 900 gold
        * We assume that when the character is equipped with a helmet, the
        attack damage from the character and the damage from the enemy is
        reduced by 20%.

#

    4.3 Card
    * price : 100
    * We assume that a character can have up to 10 cards and if it gets one extra
    card, a card is destroyed due to having too many cards.
    * We assume that when a card is destroyed, the character gets one out of 20gold, 1 health potion, 1equipment, 100XP with the same probability(25%)
    * Card drop probability = 50%

#

    4.4 Health Potion
    * price : standard: 200 gold / survival: 400 gold
    * We assume that a health potion restores the character’s HP by 30.

#

5. Rare Items
    
    5.1 The One Ring
    * price : 1500
    * We assume that ‘the one ring’ can be obtained from any enemy.

    * We assume that when ‘the one ring’ is used, the character respawns at the
    same position in which it is dead.
    * We assume that the drop rate of ‘the one ring’ is 0.5%.

#

6. Behaviour/Features
    * We assume that when the user presses ‘insert’ key, a health portion is used if it exists in the inventory.

#

7. Goals
    * We assume that a goal can be achieved by the character for the world to be considered complete and there is the condition.

    * Condition for a goal
        -> Obtaining 100000 experience points and (completing 80 cycles or amassing
        10000 gold)

#

8. Other assumptions

    * We assume that the character has a 50% chance to get an item when it kills an enemy.
    * We assume that the character can sell the item for half the original price.
    * We assume that when the character is in the castle, we can purchase items by double clicking.

9. Ally
    
    * Base health = 20
    * Base attack = 5
    * Moving speed = 2;

    * Assume Ally is a moving entity and follows the character in the world
    * Tranced Ally last 3 attacks before returning back to enemy