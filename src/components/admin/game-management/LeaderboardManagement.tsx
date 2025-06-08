
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Award, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  id: string;
  rank: number;
  playerName: string;
  score: number;
  time: number;
  game: string;
  date: string;
  verified: boolean;
}

export function LeaderboardManagement() {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState("all");
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      rank: 1,
      playerName: 'GameMaster',
      score: 98500,
      time: 125,
      game: 'Memory Game',
      date: '2024-01-15',
      verified: true
    },
    {
      id: '2',
      rank: 2,
      playerName: 'SpeedRunner',
      score: 95200,
      time: 132,
      game: 'Memory Game',
      date: '2024-01-14',
      verified: true
    },
    {
      id: '3',
      rank: 3,
      playerName: 'PuzzlePro',
      score: 92800,
      time: 145,
      game: 'Memory Game',
      date: '2024-01-13',
      verified: false
    },
    {
      id: '4',
      rank: 1,
      playerName: 'WordWizard',
      score: 87600,
      time: 280,
      game: 'Word Search',
      date: '2024-01-15',
      verified: true
    },
    {
      id: '5',
      rank: 2,
      playerName: 'SearchExpert',
      score: 84300,
      time: 295,
      game: 'Word Search',
      date: '2024-01-14',
      verified: true
    }
  ]);

  const games = ['Memory Game', 'Word Search', 'Sudoku', 'Trivia Challenge', 'Block Puzzle Pro', 'Daily Crossword'];

  const filteredEntries = selectedGame === 'all' 
    ? leaderboardEntries 
    : leaderboardEntries.filter(entry => entry.game === selectedGame);

  const handleEditEntry = (entry: LeaderboardEntry) => {
    setEditingEntry({ ...entry });
    setIsDialogOpen(true);
  };

  const handleSaveEntry = () => {
    if (!editingEntry) return;
    
    setLeaderboardEntries(prev => 
      prev.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      )
    );
    
    setIsDialogOpen(false);
    setEditingEntry(null);
    
    toast({
      title: "Entry Updated",
      description: "Leaderboard entry has been updated successfully"
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setLeaderboardEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    toast({
      title: "Entry Deleted",
      description: "Leaderboard entry has been removed",
      variant: "destructive"
    });
  };

  const handleVerifyEntry = (entryId: string) => {
    setLeaderboardEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, verified: !entry.verified } : entry
      )
    );
    
    const entry = leaderboardEntries.find(e => e.id === entryId);
    toast({
      title: entry?.verified ? "Entry Unverified" : "Entry Verified",
      description: `Entry for ${entry?.playerName} has been ${entry?.verified ? 'unverified' : 'verified'}`
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Management</CardTitle>
          <CardDescription>
            Manage and verify leaderboard entries across all games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Label htmlFor="game-filter">Filter by Game</Label>
                <Select value={selectedGame} onValueChange={setSelectedGame}>
                  <SelectTrigger id="game-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    {games.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entry.rank === 1 && <Award className="h-4 w-4 text-yellow-500" />}
                          #{entry.rank}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{entry.playerName}</TableCell>
                      <TableCell>{entry.game}</TableCell>
                      <TableCell>{entry.score.toLocaleString()}</TableCell>
                      <TableCell>{formatTime(entry.time)}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={entry.verified ? "default" : "secondary"}
                          className={entry.verified ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {entry.verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant={entry.verified ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handleVerifyEntry(entry.id)}
                          >
                            {entry.verified ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Award className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Leaderboard Entry</DialogTitle>
            <DialogDescription>
              Modify the leaderboard entry details
            </DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player-name">Player Name</Label>
                  <Input
                    id="player-name"
                    value={editingEntry.playerName}
                    onChange={(e) => setEditingEntry(prev => 
                      prev ? { ...prev, playerName: e.target.value } : null
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={editingEntry.rank}
                    onChange={(e) => setEditingEntry(prev => 
                      prev ? { ...prev, rank: parseInt(e.target.value) || 1 } : null
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    type="number"
                    value={editingEntry.score}
                    onChange={(e) => setEditingEntry(prev => 
                      prev ? { ...prev, score: parseInt(e.target.value) || 0 } : null
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time (seconds)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={editingEntry.time}
                    onChange={(e) => setEditingEntry(prev => 
                      prev ? { ...prev, time: parseInt(e.target.value) || 0 } : null
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEntry}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
