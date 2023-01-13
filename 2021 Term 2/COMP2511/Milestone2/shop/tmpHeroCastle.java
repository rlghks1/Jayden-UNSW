package unsw.loopmania.Buildings;

import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;
import unsw.loopmania.StaticEntity;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import unsw.loopmania.Character;
import unsw.loopmania.*;


public class HeroCastle extends Building{

    private static final int nItems = 7;

    private List<VampireCastle> vampireCastles;
    private List<ZombiePit> zombiePits;
    private HashMap<String,StaticEntity> shop;

    public HeroCastle (SimpleIntegerProperty x, SimpleIntegerProperty y){
        super(x, y);
        super.setType("HeroCastle");
        this.vampireCastles = new ArrayList<VampireCastle>();
        this.zombiePits = new ArrayList<ZombiePit>();
        initializeShop();
    }

    public void addVampireCastle(VampireCastle building){
        this.vampireCastles.add(building);
    }

    public void addZombiePit(ZombiePit building){
        this.zombiePits.add(building);
    }

    public void updateObservers(){
        for (VampireCastle building : vampireCastles){
            building.incrNumCycles();
        }
        for (ZombiePit building : zombiePits){
            building.incrNumCycles();
        }
    }

    public void buildingEffect(Character character){
        if (this.getX() == character.getX() && this.getY() == character.getY()){
            updateObservers();
            //shop
        }
    }

    /**
     * initialise the shop in the castle
     */
    public void initializeShop() {
        HashMap<String,StaticEntity> shop = new HashMap<String,StaticEntity>(nItems);
        SimpleIntegerProperty x = new SimpleIntegerProperty(0);
        int y = 0;
        shop.put("Sword", new Sword(x, new SimpleIntegerProperty(y)));
        shop.put("Stake", new Stake(x, new SimpleIntegerProperty(y+1)));
        shop.put("Staff", new Staff(x, new SimpleIntegerProperty(y+2)));
        shop.put("Armour", new Armour(x, new SimpleIntegerProperty(y+3)));
        shop.put("Shield", new Shield(x, new SimpleIntegerProperty(y+4)));
        shop.put("Helmet", new Helmet(x, new SimpleIntegerProperty(y+5)));
        shop.put("Health Potion", new HealthPotion(x, new SimpleIntegerProperty(y+6)));
        this.shop = shop;
    }

    /**
     * getter for shop in the castle
     * @return shop in the castle
     */
    public HashMap<String,StaticEntity> getShopItems() {
        return this.shop;
    }

}
