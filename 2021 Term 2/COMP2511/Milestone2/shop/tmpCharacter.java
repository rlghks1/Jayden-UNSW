package unsw.loopmania;


/**
 * represents the main character in the backend of the game world
 */
public class Character extends MovingEntity {
    final double initialHp = 10;
    final double initialDamage = 10;
    final double initialMovingSpeed = 2;
    final double initialXp = 0; 
    final double initialGold = 0; 
    final double initialArmour = 0;

    private double xp, gold, armour;


    public Character(PathPosition position) {
        super(position);
        this.setHp(initialHp);
        this.setDamage(initialDamage);
        this.setMovingSpeed(initialMovingSpeed);
    }

    /**
     * Move function will move the character 1 unit in clockwise direction.
     */
    public void move() {
        this.moveDownPath();
    }

    /**
     * Add certain amount of xp as increment.
     * @param xpIncrement the amount of xp gained during each battle as double.
     */
    public void addXp(double xpIncrement) {
        this.xp += xpIncrement;
    }

    /**
     * Get the Xp of current character.
     * @return Xp of current character as double.
     */
    public double getXp() {
       return this.xp; 
    }

    /**
     * Add certain amount of gold as increment.
     * @param goldIncrement the amount of gold gained during each battle as double.
     */
    public void addGold(double goldIncrement) {
        this.gold += goldIncrement;
    }

    /**
     * Get the gold of current character.
     * @return gold of current character as double.
     */
    public double getGold() {
        return this.gold;
    }

    /**
     * Set the gold of current character.
     */
    public void setGold(double gold) {
        this.gold = gold;
    }

    /**
     * Add certain amount of armour as increment.
     * @param armourIncrement the amount of armour gained by equipping armour as double.
     */
    public void addTotalArmour(double armourIncrement) {
        this.armour += armourIncrement;
    }


    /**
     * Get the total amount of armour for current character.
     * @return armour of current character.
     */
    public double getTotalArmour() {
        return this.armour;
    }

}
