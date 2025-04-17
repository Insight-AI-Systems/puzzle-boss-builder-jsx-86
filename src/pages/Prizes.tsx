
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Smartphone, Laptop, Headphones, Watch, Gamepad } from 'lucide-react';

const PRIZE_CATEGORIES = [
  { name: 'Smartphones', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Headphones', icon: Headphones },
  { name: 'Smartwatches', icon: Watch },
  { name: 'Gaming', icon: Gamepad },
];

const PRIZES = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1697831307263-8fb631f127a6?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Smartphones',
    value: '$1,199',
    puzzleCount: 5,
    featured: true,
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    image: 'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Laptops',
    value: '$1,999',
    puzzleCount: 3,
    featured: true,
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1606741965509-313c3b8a29fe?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Headphones',
    value: '$349',
    puzzleCount: 8,
    featured: false,
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Smartwatches',
    value: '$399',
    puzzleCount: 6,
    featured: false,
  },
  {
    id: 5,
    name: 'PlayStation 5',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Gaming',
    value: '$499',
    puzzleCount: 4,
    featured: true,
  },
  {
    id: 6,
    name: 'Samsung Galaxy S23 Ultra',
    image: 'https://images.unsplash.com/photo-1678911820864-e5dc2d344a1a?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Smartphones',
    value: '$1,199',
    puzzleCount: 5,
    featured: false,
  },
  {
    id: 7,
    name: 'Dell XPS 15',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Laptops',
    value: '$1,899',
    puzzleCount: 3,
    featured: false,
  },
  {
    id: 8,
    name: 'Nintendo Switch OLED',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=300&h=200',
    category: 'Gaming',
    value: '$349',
    puzzleCount: 7,
    featured: false,
  },
];

const PrizeCard = ({ prize }: { prize: typeof PRIZES[0] }) => {
  return (
    <Card className="overflow-hidden border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-b from-puzzle-black/50 to-puzzle-black/90">
        <img 
          src={prize.image} 
          alt={prize.name} 
          className="w-full h-full object-cover mix-blend-luminosity opacity-80"
        />
        {prize.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-puzzle-gold hover:bg-puzzle-gold/90">Featured</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="border-puzzle-aqua/50">{prize.category}</Badge>
          <span className="text-lg font-bold text-puzzle-gold">{prize.value}</span>
        </div>
        <CardTitle className="text-lg mt-2">{prize.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-muted-foreground">
          Available in {prize.puzzleCount} {prize.puzzleCount === 1 ? 'puzzle' : 'puzzles'}
        </p>
        <div className="mt-4">
          <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            View Puzzles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Prizes = () => {
  return (
    <PageLayout 
      title="Premium Prizes" 
      subtitle="Discover all the high-quality prizes you can win by solving puzzles"
      className="max-w-6xl"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-puzzle-aqua/10 rounded-full mb-4">
          <Trophy className="h-10 w-10 text-puzzle-gold" />
        </div>
        <h2 className="text-2xl font-bold text-puzzle-white mb-2">Authentic Brand-Name Prizes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every prize featured on The Puzzle Boss is 100% authentic and brand new. 
          Winners receive their prizes directly from authorized retailers or manufacturers.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Prizes</TabsTrigger>
          {PRIZE_CATEGORIES.map((category) => (
            <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
              <category.icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRIZES.map((prize) => (
              <PrizeCard key={prize.id} prize={prize} />
            ))}
          </div>
        </TabsContent>
        
        {PRIZE_CATEGORIES.map((category) => (
          <TabsContent key={category.name} value={category.name.toLowerCase()} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRIZES
                .filter(prize => prize.category === category.name)
                .map((prize) => (
                  <PrizeCard key={prize.id} prize={prize} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageLayout>
  );
};

export default Prizes;
