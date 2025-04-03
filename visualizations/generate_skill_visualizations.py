import json
import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import networkx as nx
from matplotlib.colors import LinearSegmentedColormap
try:
    from wordcloud import WordCloud
except ImportError:
    print("Warning: WordCloud not installed. Run 'pip install wordcloud' to enable the word cloud visualization.")
    WordCloud = None

try:
    import plotly.express as px
    import plotly.graph_objects as go
    has_plotly = True
except ImportError:
    print("Warning: Plotly not installed. Run 'pip install plotly kaleido' to enable interactive visualizations.")
    has_plotly = False

from pathlib import Path

# Set style for all plots
try:
    plt.style.use('seaborn-v0_8-whitegrid')
except:
    plt.style.use('seaborn-whitegrid')  # Fallback for older matplotlib versions
sns.set(font_scale=1.2)
sns.set_style("whitegrid", {'grid.linestyle': '--'})

# Custom color palettes
yellow_black_palette = ["#ffcf00", "#ffd633", "#ffdd66", "#ffe599", "#111111"]
skill_level_colors = {
    "avanzado": "#111111",  # Black for mastered skills
    "intermedio": "#444444",  # Dark gray for intermediate skills
    "básico": "#777777",  # Medium gray for basic skills
    "about_to_learn": "#aaaaaa"  # Light gray for skills to learn
}

# File paths - search for the data file in multiple locations
script_dir = Path(__file__).parent.resolve()
potential_data_paths = [
    script_dir / "../data/skills_profile_extended_MiguelDiLalla.json",
    script_dir.parent / "data" / "skills_profile_extended_MiguelDiLalla.json",
    Path("../data/skills_profile_extended_MiguelDiLalla.json"),
    Path("./data/skills_profile_extended_MiguelDiLalla.json"),
]

# Find the first valid path that exists
DATA_PATH = None
for path in potential_data_paths:
    if path.exists():
        DATA_PATH = path
        break

if DATA_PATH is None:
    print("Error: Could not find the skills profile JSON file.")
    print("Looked in the following locations:")
    for path in potential_data_paths:
        print(f"  - {path}")
    sys.exit(1)

# Output directory - create if it doesn't exist
OUTPUT_DIR = script_dir
if not OUTPUT_DIR.exists():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def load_skills_data():
    """Load skills data from JSON file and convert to DataFrame"""
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        
        # Convert level columns to categorical with proper order
        level_order = ['about_to_learn', 'básico', 'intermedio', 'avanzado']
        df['level_inferred'] = pd.Categorical(df['level_inferred'], categories=level_order, ordered=True)
        if 'level_confirmed' in df.columns:
            df['level_confirmed'] = pd.Categorical(df['level_confirmed'], categories=level_order, ordered=True)
        else:
            df['level_confirmed'] = None
        
        # Create a color column based on confirmed level (or inferred if confirmed is None)
        df['level_color'] = df.apply(
            lambda row: skill_level_colors.get(
                row['level_confirmed'] if pd.notna(row['level_confirmed']) else row['level_inferred'], 
                "#aaaaaa"
            ), 
            axis=1
        )
        
        return df
    except Exception as e:
        print(f"Error loading skills data: {e}")
        sys.exit(1)

def create_skill_category_distribution(df):
    """Create a bar chart showing the distribution of skills by category"""
    try:
        plt.figure(figsize=(14, 8))
        
        # Count skills per category
        category_counts = df['category'].value_counts().sort_values(ascending=False)
        
        # Create bar chart
        ax = sns.barplot(x=category_counts.index, y=category_counts.values, palette=yellow_black_palette)
        
        # Add count labels on top of bars
        for i, count in enumerate(category_counts.values):
            ax.text(i, count + 0.3, str(count), ha='center', fontweight='bold')
        
        plt.title('Skill Distribution by Category', fontsize=20, pad=20)
        plt.xlabel('Category', fontsize=16)
        plt.ylabel('Number of Skills', fontsize=16)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        
        # Save figure
        output_path = OUTPUT_DIR / 'skill_category_distribution.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created skill category distribution chart: {output_path}")
    except Exception as e:
        print(f"Error creating skill category distribution chart: {e}")

def create_skill_levels_comparison(df):
    """Create a grouped bar chart comparing inferred vs confirmed skill levels"""
    try:
        # Filter out skills where either level is missing
        skills_with_both_levels = df.dropna(subset=['level_inferred', 'level_confirmed'])
        
        if len(skills_with_both_levels) == 0:
            print("⚠ No skills with both inferred and confirmed levels found. Skipping level comparison chart.")
            return
        
        # Prepare data
        skill_names = skills_with_both_levels['name']
        x = range(len(skill_names))
        level_map = {'about_to_learn': 0, 'básico': 1, 'intermedio': 2, 'avanzado': 3}
        
        inferred_levels = [level_map.get(level, 0) for level in skills_with_both_levels['level_inferred']]
        confirmed_levels = [level_map.get(level, 0) for level in skills_with_both_levels['level_confirmed']]
        
        # Create grouped bar chart
        width = 0.35
        fig, ax = plt.subplots(figsize=(14, 10))
        
        ax.bar([i - width/2 for i in x], inferred_levels, width, label='Inferred Level', color='#ffcf00')
        ax.bar([i + width/2 for i in x], confirmed_levels, width, label='Confirmed Level', color='#111111')
        
        # Add labels and titles
        ax.set_title('Skill Levels: Inferred vs Confirmed', fontsize=20, pad=20)
        ax.set_xlabel('Skill', fontsize=16)
        ax.set_ylabel('Skill Level', fontsize=16)
        ax.set_xticks(x)
        ax.set_xticklabels(skill_names, rotation=45, ha='right')
        ax.set_yticks([0, 1, 2, 3])
        ax.set_yticklabels(['To Learn', 'Basic', 'Intermediate', 'Advanced'])
        ax.legend()
        
        plt.tight_layout()
        output_path = OUTPUT_DIR / 'skill_levels_comparison.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created skill levels comparison chart: {output_path}")
    except Exception as e:
        print(f"Error creating skill levels comparison chart: {e}")

def create_learning_vs_market_scatter(df):
    """Create a scatter plot of learning priority vs market relevance"""
    if not has_plotly:
        print("⚠ Skipping learning vs market scatter plot (Plotly not installed)")
        return
    
    try:
        # Map text values to numeric
        priority_map = {'low': 1, 'medium': 2, 'high': 3}
        relevance_map = {'low': 1, 'medium': 2, 'high': 3, 'very_high': 4}
        
        # Create copies to avoid SettingWithCopyWarning
        df_copy = df.copy()
        df_copy['priority_numeric'] = df_copy['learning_priority'].map(priority_map)
        df_copy['relevance_numeric'] = df_copy['market_relevance'].map(relevance_map)
        
        # Add jitter to prevent overlap
        np.random.seed(42)
        df_copy['priority_jitter'] = df_copy['priority_numeric'] + np.random.normal(0, 0.05, len(df_copy))
        df_copy['relevance_jitter'] = df_copy['relevance_numeric'] + np.random.normal(0, 0.05, len(df_copy))
        
        # Create interactive plotly scatter plot
        fig = px.scatter(
            df_copy, 
            x='priority_jitter', 
            y='relevance_jitter',
            text='name',
            color='visualize_as',
            size='relevance_numeric',
            hover_data=['category', 'level_inferred', 'level_confirmed'],
            labels={
                'priority_jitter': 'Learning Priority',
                'relevance_jitter': 'Market Relevance',
                'visualize_as': 'Skill Type'
            },
            title='Learning Priority vs Market Relevance',
            color_discrete_sequence=px.colors.qualitative.Bold
        )
        
        # Customize layout
        fig.update_traces(
            textposition='top center',
            marker=dict(line=dict(width=1, color='DarkSlateGrey'))
        )
        
        fig.update_layout(
            xaxis=dict(
                tickmode='array',
                tickvals=[1, 2, 3],
                ticktext=['Low', 'Medium', 'High']
            ),
            yaxis=dict(
                tickmode='array',
                tickvals=[1, 2, 3, 4],
                ticktext=['Low', 'Medium', 'High', 'Very High']
            ),
            legend_title_text='Skill Type',
            plot_bgcolor='rgba(240,240,240,0.2)'
        )
        
        # Draw quadrant lines
        fig.add_shape(
            type="line", x0=0.5, y0=2.5, x1=3.5, y1=2.5,
            line=dict(color="gray", width=1, dash="dash")
        )
        fig.add_shape(
            type="line", x0=2.5, y0=0.5, x1=2.5, y1=4.5,
            line=dict(color="gray", width=1, dash="dash")
        )
        
        # Add quadrant labels
        fig.add_annotation(x=1.5, y=3.5, text="HIGH IMPACT<br>LOW EFFORT", showarrow=False, font=dict(size=12))
        fig.add_annotation(x=3, y=3.5, text="HIGH IMPACT<br>HIGH EFFORT", showarrow=False, font=dict(size=12))
        fig.add_annotation(x=1.5, y=1.5, text="LOW IMPACT<br>LOW EFFORT", showarrow=False, font=dict(size=12))
        fig.add_annotation(x=3, y=1.5, text="LOW IMPACT<br>HIGH EFFORT", showarrow=False, font=dict(size=12))
        
        # Save as HTML for interactivity and PNG for static view
        html_path = OUTPUT_DIR / 'learning_vs_market_scatter.html'
        png_path = OUTPUT_DIR / 'learning_vs_market_scatter.png'
        
        try:
            fig.write_html(str(html_path))
            print(f"✓ Created interactive learning vs market scatter plot: {html_path}")
        except Exception as e:
            print(f"Error saving HTML plot: {e}")
        
        try:
            fig.write_image(str(png_path), width=1200, height=800, scale=2)
            print(f"✓ Created static learning vs market scatter plot: {png_path}")
        except Exception as e:
            print(f"Error saving PNG plot: {e}")
            # Try saving with matplotlib as fallback
            fallback_scatter_plot(df_copy)
    except Exception as e:
        print(f"Error creating learning vs market scatter plot: {e}")
        # Try fallback method
        fallback_scatter_plot(df)

def fallback_scatter_plot(df):
    """Create a simple scatter plot using matplotlib as fallback"""
    try:
        plt.figure(figsize=(14, 10))
        
        # Get numeric values for plotting
        priority_map = {'low': 1, 'medium': 2, 'high': 3}
        relevance_map = {'low': 1, 'medium': 2, 'high': 3, 'very_high': 4}
        
        x = [priority_map.get(p, 0) for p in df['learning_priority']]
        y = [relevance_map.get(r, 0) for r in df['market_relevance']]
        
        # Get colors based on skill type
        skill_types = df['visualize_as'].unique()
        color_map = {skill_type: plt.cm.tab10(i) for i, skill_type in enumerate(skill_types)}
        colors = [color_map.get(skill_type, 'gray') for skill_type in df['visualize_as']]
        
        # Create scatter plot
        plt.scatter(x, y, c=colors, s=100, alpha=0.7)
        
        # Add labels for each point
        for i, txt in enumerate(df['name']):
            plt.annotate(txt, (x[i], y[i]), fontsize=8, 
                        xytext=(5, 5), textcoords='offset points')
        
        # Add quadrant lines
        plt.axhline(y=2.5, color='gray', linestyle='--', alpha=0.3)
        plt.axvline(x=2.5, color='gray', linestyle='--', alpha=0.3)
        
        # Add labels
        plt.title('Learning Priority vs Market Relevance', fontsize=20, pad=20)
        plt.xlabel('Learning Priority', fontsize=16)
        plt.ylabel('Market Relevance', fontsize=16)
        plt.xticks([1, 2, 3], ['Low', 'Medium', 'High'])
        plt.yticks([1, 2, 3, 4], ['Low', 'Medium', 'High', 'Very High'])
        
        # Add legend for skill types
        handles = [plt.Line2D([0], [0], marker='o', color='w', 
                             markerfacecolor=color_map[skill_type], markersize=10) 
                  for skill_type in skill_types]
        plt.legend(handles, skill_types, title='Skill Type', loc='best')
        
        plt.tight_layout()
        fallback_path = OUTPUT_DIR / 'learning_vs_market_scatter_fallback.png'
        plt.savefig(fallback_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created fallback learning vs market scatter plot: {fallback_path}")
    except Exception as e:
        print(f"Error creating fallback scatter plot: {e}")

def create_skill_areas_heatmap(df):
    """Create a heatmap showing the frequency of skill areas"""
    try:
        # Extract and count skill areas
        all_areas = []
        for areas in df['area']:
            if isinstance(areas, list):
                all_areas.extend(areas)
        
        if not all_areas:
            print("⚠ No skill areas found. Skipping skill areas heatmap.")
            return
            
        area_counts = pd.Series(all_areas).value_counts().sort_values(ascending=False)
        
        # Create a matrix for the heatmap
        # Use categories as rows and areas as columns
        categories = df['category'].unique()
        areas = area_counts.index[:10]  # Top 10 areas
        
        heatmap_data = np.zeros((len(categories), len(areas)))
        
        for i, category in enumerate(categories):
            category_df = df[df['category'] == category]
            for j, area in enumerate(areas):
                count = sum(1 for row_areas in category_df['area'] if isinstance(row_areas, list) and area in row_areas)
                heatmap_data[i, j] = count
        
        # Create heatmap
        plt.figure(figsize=(14, 10))
        cmap = LinearSegmentedColormap.from_list("yellow_black", ["#ffffff", "#ffcf00", "#111111"])
        
        ax = sns.heatmap(
            heatmap_data, 
            annot=True, 
            fmt="d", 
            cmap=cmap,
            xticklabels=areas,
            yticklabels=categories,
            linewidths=0.5
        )
        
        plt.title('Skill Areas Distribution by Category', fontsize=20, pad=20)
        plt.xlabel('Skill Area', fontsize=16)
        plt.ylabel('Category', fontsize=16)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        
        output_path = OUTPUT_DIR / 'skill_areas_heatmap.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created skill areas heatmap: {output_path}")
    except Exception as e:
        print(f"Error creating skill areas heatmap: {e}")

def create_project_skill_network(df):
    """Create a network graph showing the relationship between projects and skills"""
    try:
        # Extract unique projects 
        all_projects = []
        for projects in df['projects']:
            if isinstance(projects, list) and projects:
                all_projects.extend(projects)
        
        unique_projects = set(all_projects)
        
        if not unique_projects:
            print("⚠ No project data found. Skipping project-skill network graph.")
            return
        
        # Create network graph
        G = nx.Graph()
        
        # Add nodes for projects
        for project in unique_projects:
            G.add_node(project, node_type='project')
        
        # Add nodes for skills (as circles) and edges
        for _, row in df.iterrows():
            skill = row['name']
            G.add_node(skill, node_type='skill', category=row['category'])
            
            if isinstance(row['projects'], list):
                for project in row['projects']:
                    if project:  # Only add edge if project exists
                        G.add_edge(skill, project)
        
        # Visualize the network
        plt.figure(figsize=(16, 12))
        
        # Position nodes using force-directed layout
        pos = nx.spring_layout(G, k=0.3, iterations=50, seed=42)
        
        # Draw nodes
        skill_nodes = [node for node in G.nodes if G.nodes[node]['node_type'] == 'skill']
        project_nodes = [node for node in G.nodes if G.nodes[node]['node_type'] == 'project']
        
        # Get category colors for skills
        category_colors = {}
        for node in skill_nodes:
            category = G.nodes[node].get('category', 'Unknown')
            if category not in category_colors:
                category_colors[category] = len(category_colors)
        
        skill_colors = [category_colors[G.nodes[node].get('category', 'Unknown')] for node in skill_nodes]
        
        # Draw nodes
        nx.draw_networkx_nodes(G, pos, nodelist=skill_nodes, node_color=skill_colors, 
                              node_size=700, alpha=0.8, cmap=plt.cm.tab20)
        nx.draw_networkx_nodes(G, pos, nodelist=project_nodes, node_color='black',
                              node_shape='s', node_size=900, alpha=0.8)
        
        # Draw edges
        nx.draw_networkx_edges(G, pos, width=1.5, alpha=0.7, edge_color='gray')
        
        # Draw labels with different colors
        nx.draw_networkx_labels(G, pos, {node: node for node in skill_nodes}, 
                               font_size=10, font_weight='bold')
        nx.draw_networkx_labels(G, pos, {node: node for node in project_nodes},
                               font_size=12, font_weight='bold', font_color='white')
        
        # Add legend for project nodes
        plt.scatter([], [], s=200, marker='s', color='black', label='Projects')
        
        # Add legend for category colors
        for category, idx in category_colors.items():
            plt.scatter([], [], c=[idx], cmap=plt.cm.tab20, s=150, label=category)
        
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=12)
        plt.title("Project-Skill Relationship Network", fontsize=20, pad=20)
        plt.axis('off')
        plt.tight_layout()
        
        output_path = OUTPUT_DIR / 'project_skill_network.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created project-skill network graph: {output_path}")
    except Exception as e:
        print(f"Error creating project-skill network graph: {e}")

def create_skill_wordcloud(df):
    """Create a word cloud of skills with size based on level and color based on type"""
    if WordCloud is None:
        print("⚠ WordCloud not installed. Skipping skill word cloud.")
        return
    
    try:
        plt.figure(figsize=(14, 10))
        
        # Prepare text and weights
        skill_names = df['name'].tolist()
        
        # Map skill levels to font sizes
        level_size_map = {
            'avanzado': 70,
            'intermedio': 50,
            'básico': 30,
            'about_to_learn': 20
        }
        
        # Create size weights dictionary
        skill_weights = {}
        for _, row in df.iterrows():
            level = row['level_confirmed'] if pd.notna(row['level_confirmed']) else row['level_inferred']
            skill_weights[row['name']] = level_size_map.get(level, 20)
        
        # Create color dictionary
        skill_colors = {row['name']: row['level_color'] for _, row in df.iterrows()}
        
        # Custom color function
        def color_func(word, **kwargs):
            return skill_colors.get(word, "#aaaaaa")
        
        # Generate word cloud
        wordcloud = WordCloud(
            width=1200, 
            height=800,
            background_color='white',
            prefer_horizontal=0.9,
            min_font_size=8,
            max_font_size=80,
            color_func=color_func
        )
        
        # Generate from frequencies
        wordcloud.generate_from_frequencies(skill_weights)
        
        # Display word cloud
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title('Skills Word Cloud', fontsize=20, pad=20)
        plt.tight_layout()
        
        output_path = OUTPUT_DIR / 'skills_wordcloud.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created skills word cloud: {output_path}")
    except Exception as e:
        print(f"Error creating skills word cloud: {e}")

def create_learning_plan_chart(df):
    """Create a chart visualizing the learning roadmap based on priority and relevance"""
    if not has_plotly:
        print("⚠ Skipping learning plan chart (Plotly not installed)")
        return
    
    try:
        # Filter to skills that are about to be learned or have specific learning priority
        learning_df = df[
            (df['level_inferred'] == 'about_to_learn') | 
            (df['learning_priority'].isin(['medium', 'high']))
        ].copy()
        
        if learning_df.empty:
            print("⚠ No skills found for learning plan chart.")
            return
        
        # Map text values to numeric
        priority_map = {'low': 1, 'medium': 2, 'high': 3}
        learning_df['priority_score'] = learning_df['learning_priority'].map(priority_map)
        
        # Sort by priority and then by name
        learning_df = learning_df.sort_values(['priority_score', 'name'], ascending=[False, True])
        
        fig = go.Figure()
        
        # Create timeline-like chart
        for i, (_, row) in enumerate(learning_df.iterrows()):
            priority = row['learning_priority']
            color = "#111111" if priority == 'high' else "#777777" if priority == 'medium' else "#aaaaaa"
            
            fig.add_trace(go.Bar(
                y=[row['name']],
                x=[row['priority_score']],
                orientation='h',
                marker_color=color,
                text=priority.capitalize(),
                textposition='inside',
                hoverinfo='text',
                hovertext=f"{row['name']} - {row['category']}<br>Priority: {priority}<br>Market: {row['market_relevance']}"
            ))
        
        # Customize layout
        fig.update_layout(
            title='Learning Roadmap: Skill Acquisition Priority',
            xaxis=dict(
                title='Priority Level',
                tickmode='array',
                tickvals=[1, 2, 3],
                ticktext=['Low', 'Medium', 'High'],
                range=[0, 3.5]
            ),
            yaxis=dict(
                title='Skill',
                autorange="reversed"  # Highest priority at the top
            ),
            height=max(600, len(learning_df) * 30),  # Dynamic height based on number of skills
            plot_bgcolor='rgba(240,240,240,0.2)'
        )
        
        try:
            html_path = OUTPUT_DIR / 'learning_roadmap.html'
            fig.write_html(str(html_path))
            print(f"✓ Created interactive learning roadmap: {html_path}")
        except Exception as e:
            print(f"Error saving HTML roadmap: {e}")
        
        try:
            png_path = OUTPUT_DIR / 'learning_roadmap.png'
            fig.write_image(str(png_path), width=1200, height=max(600, len(learning_df) * 30), scale=2)
            print(f"✓ Created static learning roadmap: {png_path}")
        except Exception as e:
            print(f"Error saving PNG roadmap: {e}")
            # Create fallback roadmap with matplotlib
            create_fallback_roadmap(learning_df)
    except Exception as e:
        print(f"Error creating learning roadmap: {e}")
        
def create_fallback_roadmap(df):
    """Create a simple horizontal bar chart for the learning roadmap using matplotlib"""
    try:
        plt.figure(figsize=(12, max(8, len(df) * 0.4)))
        
        # Sort by priority score
        df = df.sort_values('priority_score', ascending=False)
        
        # Map priority to colors
        colors = []
        for priority in df['learning_priority']:
            if priority == 'high':
                colors.append("#111111")
            elif priority == 'medium':
                colors.append("#777777")
            else:
                colors.append("#aaaaaa")
        
        # Create horizontal bar chart
        plt.barh(df['name'], df['priority_score'], color=colors)
        
        # Add labels
        plt.title('Learning Roadmap: Skill Acquisition Priority', fontsize=18)
        plt.xlabel('Priority Level', fontsize=14)
        plt.ylabel('Skill', fontsize=14)
        plt.xticks([1, 2, 3], ['Low', 'Medium', 'High'])
        plt.tight_layout()
        
        # Save figure
        output_path = OUTPUT_DIR / 'learning_roadmap_fallback.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Created fallback learning roadmap: {output_path}")
    except Exception as e:
        print(f"Error creating fallback learning roadmap: {e}")

def main():
    print("📊 Generating skill visualizations...")
    print(f"Data source: {DATA_PATH}")
    print(f"Output directory: {OUTPUT_DIR}")
    print("-" * 50)
    
    # Load data
    df = load_skills_data()
    print(f"Loaded {len(df)} skills from the profile data")
    
    # Create visualizations with progress tracking
    visualizations = [
        ("Skill Category Distribution", create_skill_category_distribution),
        ("Skill Levels Comparison", create_skill_levels_comparison),
        ("Learning vs Market Relevance", create_learning_vs_market_scatter),
        ("Skill Areas Heatmap", create_skill_areas_heatmap),
        ("Project-Skill Network", create_project_skill_network),
        ("Skills Word Cloud", create_skill_wordcloud),
        ("Learning Roadmap", create_learning_plan_chart)
    ]
    
    for name, func in visualizations:
        print(f"\nGenerating {name}...")
        func(df)
    
    print("\n" + "-" * 50)
    print(f"✅ Visualizations created in {OUTPUT_DIR}")
    print("\nGenerated visualizations:")
    print("1. skill_category_distribution.png - Bar chart of skills by category")
    print("2. skill_levels_comparison.png - Comparison of inferred vs confirmed skill levels")
    print("3. learning_vs_market_scatter.png/html - Interactive scatter plot of learning priority vs market relevance")
    print("4. skill_areas_heatmap.png - Heatmap showing the distribution of skill areas")
    print("5. project_skill_network.png - Network graph showing relationships between projects and skills")
    print("6. skills_wordcloud.png - Word cloud of skills with size based on level")
    print("7. learning_roadmap.png/html - Chart showing the learning priority roadmap")

if __name__ == "__main__":
    main()