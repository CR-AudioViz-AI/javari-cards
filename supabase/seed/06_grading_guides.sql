-- ============================================================================
-- CRAVCARDS SEED DATA: GRADING GUIDES
-- Complete guides for PSA, BGS, CGC, SGC
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO grading_guides (company, title, slug, content, grade_scale, pricing_info, submission_info, turnaround_times, tips, is_featured) VALUES

-- ============================================================================
-- PSA GRADING GUIDE
-- ============================================================================
('PSA', 'Complete PSA Grading Guide', 'psa-grading-guide', 
'# PSA Grading Guide

Professional Sports Authenticator (PSA) is the largest and most recognized third-party grading service in the hobby. Founded in 1991, PSA has graded over 50 million cards.

## Why Choose PSA?

- **Market Leader**: Most recognized brand, commands highest premiums
- **Established Trust**: 30+ years of consistent grading
- **Strong Resale Value**: PSA 10s typically sell for more than competitors
- **Population Reports**: Comprehensive database of all graded cards

## PSA Grading Scale (1-10)

### PSA 10 (Gem Mint)
A virtually perfect card. Sharp corners, perfect centering (60/40 or better), no staining, no print defects, flawless surface.

**Requirements:**
- Centering: 60/40 or better front and back
- Corners: Sharp and unblemished on all four
- Edges: Smooth with no chipping or wear
- Surface: No print defects, scratches, or staining

### PSA 9 (Mint)
A superb condition card with one minor flaw. Could be very slight centering issue (65/35), one soft corner, or minor print defect.

### PSA 8 (Near Mint-Mint)
A super high-end card with only slight surface wear, light wear on corners, and slight print spots. Centering can be off (70/30).

### PSA 7 (Near Mint)
A card with just slight surface wear visible upon close inspection. Some fraying on corners.

### PSA 6 (Excellent-Mint)
Visible wear on edges and corners. May have minor print defects.

### PSA 5 (Excellent)
Noticeable surface wear. Corners show wear. May have light creasing.

### PSA 4 and Below
Cards showing obvious handling, creasing, or damage.

### PSA Authentic
Card is authentic but cannot be graded due to alterations, trimming, or evidence of cleaning.

## Submission Tips

1. **Use the 10x Rule**: Only grade if potential value is 10x grading cost
2. **Check centering first**: Most common reason for grade reduction
3. **Inspect all corners under bright light**
4. **Look for surface scratches at an angle**
5. **Use PSA bulk for cards valued $50-250**
6. **Join Collectors Club for discounts**',

'{"min": 1, "max": 10, "increments": [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10], "special": ["Authentic"]}',
'{"economy": "$25 for cards under $500", "regular": "$75 for 20-day turnaround", "express": "$150 for 10-day", "super_express": "$300 for 5-day", "walk_through": "$600 for same day"}',
'{"website": "https://www.psacard.com", "account_required": true, "bulk_minimum": 20}',
'[{"tier": "Economy", "days": 65, "price": 25}, {"tier": "Regular", "days": 20, "price": 75}, {"tier": "Express", "days": 10, "price": 150}]',
ARRAY['Use PSA bulk submission for groups of 20+ cards', 'Declare accurate values for insurance', 'Check PSA pop reports before submitting', 'Request minimum grade if only want PSA 8+ back', 'Join PSA Collectors Club for discounts'],
true),

-- ============================================================================
-- BGS GRADING GUIDE
-- ============================================================================
('BGS', 'Complete BGS Grading Guide', 'bgs-grading-guide',
'# BGS (Beckett Grading Services) Guide

Beckett Grading Services (BGS) is the premier choice for modern cards and offers the only subgrade system in the hobby.

## Why Choose BGS?

- **Subgrades**: Four separate grades for detailed condition
- **Black Labels**: The holy grail of graded cards
- **Half-Point Increments**: More precise grading than PSA
- **Modern Card Preference**: Often preferred for high-end modern

## BGS Grading Scale

### BGS 10 (Pristine)
Perfect in all aspects. Must achieve 10 in all subgrade categories. Results in a Black Label.

### BGS 9.5 (Gem Mint)
Near perfect with very minor imperfections. The most common high grade.

### BGS 9 (Mint)
A superb condition card with only very slight imperfections.

## The Four Subgrades

1. **Centering**: How well-centered the image is
2. **Corners**: Sharpness of all four corners
3. **Edges**: Smoothness of all four edges
4. **Surface**: Condition of the card surface

## Black Label Explained

A BGS Black Label requires perfect 10s in ALL four subgrades. These are extremely rare and command massive premiums - often 2-5x a regular BGS 10.

## Subgrade Math

Your overall grade is calculated from subgrades:
- Average subgrades, round down to nearest .5
- One low subgrade can pull down the whole grade

## Submission Tips

1. **BGS is stricter than PSA** - adjust expectations
2. **Subgrades add value** - a 9.5 with four 9.5s > a 9.5 with a 9
3. **Consider BGS for modern high-end cards**
4. **Check centering carefully** - BGS is strict on this
5. **Half-points matter** - aim for 9.5+ for best value',

'{"min": 1, "max": 10, "increments": [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10], "special": ["Pristine", "Black Label"]}',
'{"economy": "$20 for 60+ day turnaround", "standard": "$35 for 20-day", "express": "$80 for 10-day", "premium": "$150 for 5-day"}',
'{"website": "https://www.beckett.com/grading", "account_required": true, "bulk_options": true}',
'[{"tier": "Economy", "days": 60, "price": 20}, {"tier": "Standard", "days": 20, "price": 35}, {"tier": "Express", "days": 10, "price": 80}]',
ARRAY['BGS Black Labels command 2-5x premiums', 'Subgrades help buyers understand condition', 'A 9.5 with all 9.5 subgrades is worth more than one with a 9', 'BGS 10 is harder than PSA 10', 'Check centering before submitting'],
true),

-- ============================================================================
-- CGC GRADING GUIDE
-- ============================================================================
('CGC', 'Complete CGC Grading Guide', 'cgc-grading-guide',
'# CGC Trading Cards Guide

CGC (Certified Guaranty Company) entered trading card grading in 2020, bringing expertise from comic book grading.

## Why Choose CGC?

- **Competitive Pricing**: Often cheaper than PSA/BGS
- **Subgrades Available**: Optional like BGS
- **Fast Turnaround**: Generally quicker than competitors
- **Growing Acceptance**: Increasing market recognition
- **Comic Grading Heritage**: Decades of authentication expertise

## CGC Grading Scale

### CGC Pristine 10
Perfect in all aspects. Must achieve 10 in all subgrade categories.

### CGC Gem Mint 10
A virtually perfect card. One subgrade may be 9.5 while others are 10.

### CGC Mint+ 9.5
Near perfect with very minor imperfections not immediately visible.

### CGC Mint 9
A superb condition card with only very slight imperfections.

## Subgrades (Optional)

Like BGS, CGC offers four subgrades:
- Centering
- Corners
- Edges
- Surface

## Market Position

CGC is growing in acceptance, particularly for:
- Pokemon cards
- Budget-conscious collectors
- Those wanting subgrades at lower cost than BGS

## Submission Tips

1. **CGC often has faster turnaround**
2. **Good alternative to PSA during backlogs**
3. **Subgrades optional** - choose based on card value
4. **Growing resale market acceptance**
5. **Consider for mid-tier cards**',

'{"min": 1, "max": 10, "increments": [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10], "special": ["Pristine"]}',
'{"economy": "$15 for economy", "standard": "$25 for standard", "express": "$50 for express"}',
'{"website": "https://www.cgccards.com", "account_required": true}',
'[{"tier": "Economy", "days": 45, "price": 15}, {"tier": "Standard", "days": 15, "price": 25}, {"tier": "Express", "days": 5, "price": 50}]',
ARRAY['CGC is growing in market acceptance', 'Good value compared to PSA/BGS', 'Optional subgrades available', 'Consider for Pokemon cards', 'Faster turnaround than PSA'],
false),

-- ============================================================================
-- SGC GRADING GUIDE
-- ============================================================================
('SGC', 'Complete SGC Grading Guide', 'sgc-grading-guide',
'# SGC (Sportscard Guaranty Corporation) Guide

SGC is known for its distinctive "tuxedo" black holders and is particularly respected for vintage card grading.

## Why Choose SGC?

- **Vintage Expertise**: Preferred by many vintage collectors
- **Distinctive Holders**: Iconic black "tuxedo" slabs
- **Faster Turnaround**: Often quicker than PSA
- **Value Pricing**: Better value than PSA for many submissions
- **Authentication Focus**: Strong counterfeit detection

## SGC Grading Scale

### SGC 10 (Pristine/Gem Mint)
A virtually perfect card meeting the highest standards.

### SGC 9.5 (Mint+)
Near perfect with only the slightest imperfections.

### SGC 9 (Mint)
A superb condition card with very minor flaws.

## Vintage Card Grading

SGC is particularly respected for:
- Pre-war cards (T206, etc.)
- 1950s-1970s cards
- Any vintage submission

Many vintage collectors specifically prefer SGC slabs.

## The Tuxedo Holder

SGCs distinctive black border holder is:
- Instantly recognizable
- Preferred by some collectors
- Shows card well against dark background

## Crossover Potential

Some collectors:
- Grade at SGC first (faster, cheaper)
- Crossover high grades to PSA
- Keep exceptional cards in SGC

## Submission Tips

1. **SGC excels at vintage cards**
2. **Faster and cheaper than PSA**
3. **Growing modern card acceptance**
4. **Consider for vintage before PSA**
5. **Tuxedo holders have strong following**',

'{"min": 1, "max": 10, "increments": [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.5, 10], "special": ["Authentic"]}',
'{"economy": "$20 for economy", "regular": "$30 for regular", "express": "$100 for express"}',
'{"website": "https://www.gosgc.com", "account_required": true}',
'[{"tier": "Economy", "days": 30, "price": 20}, {"tier": "Regular", "days": 15, "price": 30}, {"tier": "Express", "days": 5, "price": 100}]',
ARRAY['SGC is preferred for vintage cards', 'Faster turnaround than PSA', 'Tuxedo holders have dedicated following', 'Good value pricing', 'Strong authentication for vintage'],
false),

-- ============================================================================
-- GENERAL GRADING 101
-- ============================================================================
('General', 'Card Grading 101 - Complete Beginners Guide', 'card-grading-101',
'# Card Grading 101

Everything you need to know about getting your cards professionally graded.

## What is Card Grading?

Professional card grading is the process of having a third-party company authenticate and assess the condition of your cards. Cards are encapsulated in tamper-evident holders with a grade indicating their condition.

## Why Grade Your Cards?

1. **Authentication**: Proves your card is genuine
2. **Protection**: Sealed in protective cases
3. **Standardization**: Universal condition language
4. **Value**: High-grade cards sell for premiums
5. **Liquidity**: Easier to sell graded cards

## When Should You Grade?

### Grade When:
- Card value exceeds grading cost significantly (10x rule)
- Card appears to be high grade (8+)
- You plan to sell or insure the card
- Authentication is important

### Dont Grade When:
- Card has obvious flaws
- Value doesnt justify cost
- Already graded at acceptable grade
- Grading commons or low-value cards

## The 10x Rule

Only grade cards where potential graded value is at least 10x the cost of grading.

**Example**: If grading costs $30, the card should be worth at least $300 graded.

## Choosing a Grading Company

### PSA - Best For:
- Sports cards (highest premiums)
- Pokemon cards (most recognized)
- Maximum resale value

### BGS - Best For:
- Modern high-end cards
- When you want subgrades
- Chasing Black Labels

### CGC - Best For:
- Budget-conscious collectors
- Faster turnaround
- Growing market acceptance

### SGC - Best For:
- Vintage cards (pre-1970)
- Value submissions
- Faster than PSA

## How to Prepare Cards

### Step 1: Assess Your Cards
- Use good lighting and magnification
- Check centering, corners, edges, surface
- Be realistic about condition

### Step 2: Clean Environment
- Work on clean surface
- Wash hands thoroughly
- Consider cotton gloves for valuable cards

### Step 3: Proper Storage
- Place card in new penny sleeve
- Insert into Card Saver 1
- Card Saver 1 preferred for most submissions

### Step 4: Label and Declare
- Fill out submission forms accurately
- Declare honest values for insurance
- Note any special requests

## Understanding Your Grade

When you receive your graded card, review:
- The grade assigned
- Any subgrades (if applicable)
- Certification number
- Card description matches submission',

'{"min": 1, "max": 10, "note": "Varies by company"}',
'{"varies": "See individual company guides"}',
'{"note": "See individual company guides for submission details"}',
'[]',
ARRAY['Use the 10x rule before submitting', 'Check centering first - most common issue', 'Always photograph cards before submitting', 'Start with lower value cards to learn', 'Join collector communities for tips'],
true)

ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  tips = EXCLUDED.tips,
  is_featured = EXCLUDED.is_featured;
