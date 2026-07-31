begin;

-- Existing senior-provided events. Inserts are non-destructive when rerun.
insert into public.events (
  id,
  title,
  slug,
  short_description,
  description,
  start_at,
  end_at,
  venue,
  category,
  status,
  is_featured,
  is_published,
  display_order
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Inauguration of SESA',
    'inauguration-sesa',
    'The official launch of the Software Engineering Student Association.',
    'The official launch of the Software Engineering Student Association, marking the beginning of a new chapter for technical collaboration and community building at MITAOE.',
    '2026-02-16 10:00:00+05:30',
    '2026-02-16 13:00:00+05:30',
    'Auditorium',
    'Showcase',
    'completed',
    false,
    true,
    1
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'FRAMEFEST''26',
    'framefest26',
    'Showcase your best clicks, edits, memories, and moments.',
    E'Every frame has a story. Every reel has a voice. ✨\n\nIt''s time to turn your creativity into something unforgettable! 📸🎥\n\nJoin FRAMEFEST''26 and showcase your best clicks, edits, memories, and moments.\n\n🌍 Travel • 🎭 Culture • 💻 Innovation • 🌱 Nature • 📚 Campus Life • and more!',
    '2026-06-17 00:00:00+05:30',
    '2026-07-02 23:59:59+05:30',
    'MITAOE Campus',
    'Contest',
    'completed',
    false,
    true,
    2
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Induction',
    'induction-2026',
    'Orientation programme for second-year students joining the SESA community.',
    'Orientation programme for second-year students to welcome them into the SESA community and introduce them to the association''s activities, teams, and opportunities.',
    null,
    null,
    'TBA',
    'Orientation',
    'upcoming',
    false,
    true,
    3
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Sports Tournament',
    'sports-tournament',
    'Department-level sports tournament for students.',
    'Department-level sports tournament for students. Compete, collaborate, and represent your department in a wide range of athletic events.',
    null,
    null,
    'TBA',
    'Sports',
    'upcoming',
    false,
    true,
    4
  )
on conflict do nothing;

-- Existing SESA committee members. Emails are preserved but private by default
-- until an administrator records explicit approval to publish each address.
insert into public.team_members (
  id,
  full_name,
  role,
  member_group,
  year,
  email,
  is_email_public,
  display_order,
  is_active
)
values
  ('20000000-0000-4000-8000-000000000001', 'Aarya Balu Malghe', 'Core Member', 'Core Members', 'B.Tech', '202301100061@mitaoe.ac.in', false, 1, true),
  ('20000000-0000-4000-8000-000000000002', 'Ayush Chandekar', 'Executive Member', 'Executive Members', 'B.Tech', '202301100034@mitaoe.ac.in', false, 2, true),
  ('20000000-0000-4000-8000-000000000003', 'Kishor Krishna Mugale', 'Core Member', 'Core Members', 'B.Tech', '202402100008@mitaoe.ac.in', false, 3, true),
  ('20000000-0000-4000-8000-000000000004', 'Mahesh Shamrao Dhote', 'Core Member', 'Core Members', 'B.Tech', '202402100009@mitaoe.ac.in', false, 4, true),
  ('20000000-0000-4000-8000-000000000005', 'Prachi Tukaram Phunde', 'Core Member', 'Core Members', 'B.Tech', '202301100042@mitaoe.ac.in', false, 5, true),
  ('20000000-0000-4000-8000-000000000006', 'Sanket Rath', 'Executive Member', 'Executive Members', 'B.Tech', '202301100006@mitaoe.ac.in', false, 6, true),
  ('20000000-0000-4000-8000-000000000007', 'Shubham Pawade', 'Core Member', 'Core Members', 'B.Tech', '202301100028@mitaoe.ac.in', false, 7, true),
  ('20000000-0000-4000-8000-000000000008', 'Siddhant Kumar Sahu', 'Core Member', 'Core Members', 'B.Tech', '202301070159@mitaoe.ac.in', false, 8, true),
  ('20000000-0000-4000-8000-000000000009', 'Aaditi Mahesh Bhalerao', 'Executive Member', 'Executive Members', 'TY', '202401100057@mitaoe.ac.in', false, 9, true),
  ('20000000-0000-4000-8000-000000000010', 'Aditya Shankar Patil', 'Core Member', 'Core Members', 'TY', '202401100094@mitaoe.ac.in', false, 10, true),
  ('20000000-0000-4000-8000-000000000011', 'Aman Pathan', 'Executive Member', 'Executive Members', 'TY', '202401100060@mitaoe.ac.in', false, 11, true),
  ('20000000-0000-4000-8000-000000000012', 'Anvith Ashok Shetty', 'Executive Member', 'Executive Members', 'TY', '202401100138@mitaoe.ac.in', false, 12, true),
  ('20000000-0000-4000-8000-000000000013', 'Chaitanya Yogesh Umbarkar', 'Executive Member', 'Executive Members', 'TY', '202401100080@mitaoe.ac.in', false, 13, true),
  ('20000000-0000-4000-8000-000000000014', 'GORE YOGESH NAGNATH', 'Core Member', 'Core Members', 'TY', '202502100001@mitaoe.ac.in', false, 14, true),
  ('20000000-0000-4000-8000-000000000015', 'Indrajeet Gire', 'Core Member', 'Core Members', 'TY', '202401100059@mitaoe.ac.in', false, 15, true),
  ('20000000-0000-4000-8000-000000000016', 'Jay Yogesh Nimase', 'Executive Member', 'Executive Members', 'TY', '202401100121@mitaoe.ac.in', false, 16, true),
  ('20000000-0000-4000-8000-000000000017', 'Janhavi Hinganghatkar', 'Executive Member', 'Executive Members', 'TY', '202401100025@mitaoe.ac.in', false, 17, true),
  ('20000000-0000-4000-8000-000000000018', 'Karthik Jayakumar', 'Executive Member', 'Executive Members', 'TY', '202401100070@mitaoe.ac.in', false, 18, true),
  ('20000000-0000-4000-8000-000000000019', 'Madhav Rungta', 'Executive Member', 'Executive Members', 'TY', '202401100097@mitaoe.ac.in', false, 19, true),
  ('20000000-0000-4000-8000-000000000020', 'Neha Anant Pagar', 'Core Member', 'Core Members', 'TY', '202401100149@mitaoe.ac.in', false, 20, true),
  ('20000000-0000-4000-8000-000000000021', 'Rachmale Shruti Ravindra', 'Executive Member', 'Executive Members', 'TY', '202401100045@mitaoe.ac.in', false, 21, true),
  ('20000000-0000-4000-8000-000000000022', 'Sumit Sanjay Jadhav', 'Executive Member', 'Executive Members', 'TY', '202401100023@mitaoe.ac.in', false, 22, true),
  ('20000000-0000-4000-8000-000000000023', 'Tanaya Sudhir Mukwane', 'Core Member', 'Core Members', 'TY', '202401100063@mitaoe.ac.in', false, 23, true),
  ('20000000-0000-4000-8000-000000000024', 'Tejas Vinod Yendole', 'Core Member', 'Core Members', 'TY', '202401100054@mitaoe.ac.in', false, 24, true),
  ('20000000-0000-4000-8000-000000000025', 'Aryan Chaudhari', 'Core Member', 'Core Members', 'SY', '202401100142@mitaoe.ac.in', false, 25, true)
on conflict do nothing;

-- The previous CodeCraft banner had no matching senior-provided event and was
-- stale placeholder content, so no announcement is invented or seeded here.

commit;
