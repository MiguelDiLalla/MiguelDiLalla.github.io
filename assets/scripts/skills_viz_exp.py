import json
import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

class SkillsVisualizer:
    """Generate professional visualizations from skills data."""
    
    def __init__(self, json_path='data/skill.json'):
        """Initialize with path to skills JSON file."""
        self.json_path = json_path
        self.output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                      'assets', 'images', 'skills')
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Load and process data
        self._load_data()
        
    def _load_data(self):
        """Load skills data from JSON and prepare for visualization."""
        try:
            with open(self.json_path, 'r', encoding='utf-8') as f:
                self.skills_data = json.load(f)
                
            # Convert to DataFrame
            self.df = pd.DataFrame(self.skills_data)
            
            # Map skill levels to numeric values
            level_map = {
                "básico": 1, 
                "intermedio": 2, 
                "avanzado": 3,
                "about_to_learn": 0
            }
            self.df['level_num'] = self.df['level'].map(level_map)
            
            print(f"Successfully loaded {len(self.df)} skills from {self.json_path}")
            
        except Exception as e:
            print(f"Error loading skill data: {e}")
            raise
    
    def generate_heatmap(self):
        """Create skill proficiency heatmap visualization."""
        try:
            # Create pivot table for heatmap
            pivot_df = self.df.pivot_table(
                index='category', 
                columns='skill', 
                values='level_num', 
                aggfunc='first'
            ).fillna(0)
            
            # Create heatmap
            plt.figure(figsize=(12, 8))
            cmap = sns.color_palette("YlOrRd", as_cmap=True)
            ax = sns.heatmap(
                pivot_df, 
                cmap=cmap,
                linewidths=1,
                annot=True,
                fmt='.0f',
                cbar_kws={'label': 'Proficiency Level'}
            )
            plt.title('Skill Proficiency by Category', fontsize=16, pad=20)
            plt.tight_layout()
            
            # Save figure
            output_path = os.path.join(self.output_dir, 'heatmap.png')
            plt.savefig(output_path, dpi=300, bbox_inches='tight', transparent=True)
            plt.close()
            
            print(f"Heatmap saved to {output_path}")
            
        except Exception as e:
            print(f"Error generating heatmap: {e}")
    
    def generate_category_barchart(self):
        """Create horizontal grouped bar chart by category."""
        try:
            # Create horizontal grouped bar chart
            plt.figure(figsize=(14, 10))
            
            # Group by category and count skill levels
            category_counts = self.df.groupby(['category', 'level']).size().unstack().fillna(0)
            
            # Sort categories by total skill count
            category_counts['total'] = category_counts.sum(axis=1)
            category_counts = category_counts.sort_values('total', ascending=True).drop('total', axis=1)
            
            # Plot
            colors = ["#ffcf00", "#ff9500", "#ff4d00", "#e6e6e6"]  # Yellow to orange gradient
            ax = category_counts.plot.barh(stacked=True, figsize=(12, 10), color=colors)
            
            plt.title('Skills Distribution by Category and Proficiency Level', fontsize=16)
            plt.xlabel('Number of Skills')
            plt.legend(title='Proficiency Level')
            plt.grid(axis='x', linestyle='--', alpha=0.7)
            
            # Add annotations
            for i, (idx, row) in enumerate(category_counts.iterrows()):
                total = row.sum()
                plt.text(total + 0.3, i, f"{total:.0f}", va='center')
            
            plt.tight_layout()
            
            # Save figure
            output_path = os.path.join(self.output_dir, 'skill_distribution.png')
            plt.savefig(output_path, dpi=300, bbox_inches='tight', transparent=True)
            plt.close()
            
            print(f"Bar chart saved to {output_path}")
            
        except Exception as e:
            print(f"Error generating bar chart: {e}")
    
    def generate_radar_chart(self):
        """Create radar chart for core skills."""
        try:
            # Get core skills
            core_skills = self.df[self.df['visualize_as'] == 'core_skill']
            core_skills = core_skills.sort_values('level_num', ascending=False).head(8)
            
            # Prepare the data
            categories = core_skills['skill'].tolist()
            values = core_skills['level_num'].tolist()
            
            # Close the loop for the radar chart
            categories = categories + [categories[0]]
            values = values + [values[0]]
            
            # Create angles for each skill
            angles = np.linspace(0, 2*np.pi, len(categories), endpoint=True)
            
            # Create the plot
            fig = plt.figure(figsize=(10, 10))
            ax = fig.add_subplot(111, polar=True)
            
            # Draw the chart
            ax.fill(angles, values, color='#ffcf00', alpha=0.25)
            ax.plot(angles, values, color='#ffcf00', linewidth=2)
            
            # Add labels
            ax.set_xticks(angles)
            ax.set_xticklabels(categories, size=12)
            ax.set_yticks([0, 1, 2, 3])
            ax.set_yticklabels(['', 'Basic', 'Intermediate', 'Advanced'], size=10)
            ax.set_rlabel_position(180 / len(categories))
            
            plt.title('Core Skills Proficiency', size=16, y=1.1)
            plt.tight_layout()
            
            # Save figure
            output_path = os.path.join(self.output_dir, 'radar_chart.png')
            plt.savefig(output_path, dpi=300, bbox_inches='tight', transparent=True)
            plt.close()
            
            print(f"Radar chart saved to {output_path}")
            
        except Exception as e:
            print(f"Error generating radar chart: {e}")
    
    def generate_all(self):
        """Generate all visualizations."""
        print("Generating skill visualizations...")
        self.generate_heatmap()
        self.generate_category_barchart()
        self.generate_radar_chart()
        print("All visualizations completed!")


if __name__ == "__main__":
    # Use relative paths from the script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    json_path = os.path.join(project_root, 'data', 'skill.json')
    
    visualizer = SkillsVisualizer(json_path=json_path)
    visualizer.generate_all()