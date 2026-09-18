import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(const FinancialMaxApp());

class FinancialMaxApp extends StatelessWidget {
  const FinancialMaxApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Financial Max',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      brightness: Brightness.dark,
      useMaterial3: true,
      scaffoldBackgroundColor: const Color(0xFF080A0F),
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7C5CFF), brightness: Brightness.dark),
      cardTheme: const CardThemeData(color: Color(0xFF11141C)),
    ),
    home: const Dashboard(),
  );
}

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});
  @override State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  double balance=0, income=0, expenses=0, saved=0, invested=0;
  int xp=0, tab=0;
  final transactions=<Map<String,dynamic>>[];

  @override
  void initState(){super.initState(); _load();}
  Future<void> _load() async {
    final p=await SharedPreferences.getInstance();
    setState(() {
      balance=p.getDouble('balance')??0; income=p.getDouble('income')??0;
      expenses=p.getDouble('expenses')??0; saved=p.getDouble('saved')??0;
      invested=p.getDouble('invested')??0; xp=p.getInt('xp')??0;
    });
  }
  Future<void> _save() async {
    final p=await SharedPreferences.getInstance();
    await p.setDouble('balance',balance); await p.setDouble('income',income);
    await p.setDouble('expenses',expenses); await p.setDouble('saved',saved);
    await p.setDouble('invested',invested); await p.setInt('xp',xp);
  }
  void addMoney(bool isIncome) {
    final c=TextEditingController();
    showDialog(context:context,builder:(_)=>AlertDialog(
      title:Text(isIncome?'Add Income':'Add Expense'),
      content:TextField(controller:c,keyboardType:TextInputType.number,decoration:const InputDecoration(prefixText:'KSh ')),
      actions:[TextButton(onPressed:()=>Navigator.pop(context),child:const Text('Cancel')),
      FilledButton(onPressed:(){
        final v=double.tryParse(c.text)??0;
        if(v>0)setState((){if(isIncome){income+=v;balance+=v;}else{expenses+=v;balance-=v;}xp+=isIncome?5:3;});
        _save(); Navigator.pop(context);
      },child:const Text('Save'))],
    ));
  }
  @override
  Widget build(BuildContext context){
    final pages=[
      _home(), _simplePage('Income','Track every source of money you earn.'),
      _simplePage('Expenses','Record where every shilling goes.'),
      _simplePage('Goals','Create targets and track progress.'),
      _simplePage('Growth','Savings, investments and net-worth tracking.')
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('FINANCIAL MAX',style:TextStyle(fontWeight:FontWeight.w800))),
      body:pages[tab],
      floatingActionButton: tab==0 ? FloatingActionButton.extended(
        onPressed:()=>showModalBottomSheet(context:context,builder:(_)=>SafeArea(child:Wrap(children:[
          ListTile(leading:const Icon(Icons.add_circle),title:const Text('Add income'),onTap:(){Navigator.pop(context);addMoney(true);}),
          ListTile(leading:const Icon(Icons.remove_circle),title:const Text('Add expense'),onTap:(){Navigator.pop(context);addMoney(false);}),
        ]))), label:const Text('Transaction')):null,
      bottomNavigationBar:NavigationBar(selectedIndex:tab,onDestinationSelected:(i)=>setState(()=>tab=i),
        destinations:const[
          NavigationDestination(icon:Icon(Icons.dashboard_outlined),label:'Home'),
          NavigationDestination(icon:Icon(Icons.trending_up),label:'Income'),
          NavigationDestination(icon:Icon(Icons.receipt_long),label:'Expenses'),
          NavigationDestination(icon:Icon(Icons.flag_outlined),label:'Goals'),
          NavigationDestination(icon:Icon(Icons.show_chart),label:'Growth'),
        ]),
    );
  }
  Widget _home()=>SingleChildScrollView(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[
    const Text('COMMAND CENTER',style:TextStyle(letterSpacing:2,fontSize:12,color:Colors.white70)),
    const SizedBox(height:8),
    Card(child:Padding(padding:const EdgeInsets.all(20),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[
      const Text('Available Balance',style:TextStyle(color:Colors.white70)),
      const SizedBox(height:6),Text('KSh ${NumberFormat('#,##0.00').format(balance)}',style:const TextStyle(fontSize:32,fontWeight:FontWeight.w900)),
      const SizedBox(height:14),Row(children:[
        Expanded(child:_stat('Income',income)),Expanded(child:_stat('Expenses',expenses)),Expanded(child:_stat('Saved',saved))
      ])
    ]))),
    const SizedBox(height:12),Row(children:[
      Expanded(child:_mini('Net Worth',balance+invested)),Expanded(child:_mini('Investments',invested))
    ]),
    const SizedBox(height:20),const Text('FINANCIAL PROGRESSION',style:TextStyle(letterSpacing:1.5,fontWeight:FontWeight.bold)),
    const SizedBox(height:10),Card(child:ListTile(
      leading:CircleAvatar(child:Text('${(xp~/100)+1}')),
      title:Text('Level ${(xp~/100)+1} — ${_levelName()}'),
      subtitle:Text('$xp XP • ${xp%100}/100 to next level'),
      trailing:SizedBox(width:70,child:LinearProgressIndicator(value:(xp%100)/100)),
    )),
    const SizedBox(height:20),const Text('QUICK ACTIONS',style:TextStyle(letterSpacing:1.5,fontWeight:FontWeight.bold)),
    const SizedBox(height:10),Wrap(spacing:10,runSpacing:10,children:[
      _action(Icons.add,'Income',()=>addMoney(true)),_action(Icons.remove,'Expense',()=>addMoney(false)),
      _action(Icons.savings,'Save',(){setState(()=>saved+=0);}),_action(Icons.insights,'Review',(){})
    ]),
    const SizedBox(height:20),Card(child:const ListTile(leading:Icon(Icons.shield_outlined),title:Text('Financial rule'),subtitle:Text('Protect essentials first, then build savings and growth.')))
  ]));
  Widget _stat(String n,double v)=>Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(n,style:const TextStyle(fontSize:12,color:Colors.white60)),Text('KSh ${NumberFormat('#,##0').format(v)}',style:const TextStyle(fontWeight:FontWeight.bold))]);
  Widget _mini(String n,double v)=>Card(child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(n,style:const TextStyle(color:Colors.white60)),const SizedBox(height:5),Text('KSh ${NumberFormat('#,##0').format(v)}',style:const TextStyle(fontSize:18,fontWeight:FontWeight.bold))])));
  Widget _action(IconData i,String t,VoidCallback f)=>FilledButton.icon(onPressed:f,icon:Icon(i),label:Text(t));
  Widget _simplePage(String title,String subtitle)=>Center(child:Padding(padding:const EdgeInsets.all(24),child:Column(mainAxisAlignment:MainAxisAlignment.center,children:[
    Icon(title=='Growth'?Icons.show_chart:title=='Goals'?Icons.flag_outlined:Icons.account_balance_wallet_outlined,size:64),
    const SizedBox(height:18),Text(title,style:const TextStyle(fontSize:30,fontWeight:FontWeight.w800)),
    const SizedBox(height:8),Text(subtitle,textAlign:TextAlign.center,style:const TextStyle(color:Colors.white70)),
    const SizedBox(height:22),const Text('Foundation connected. Advanced modules can be added on top of the core finance engine.',textAlign:TextAlign.center)
  ])));
  String _levelName(){final l=(xp~/100)+1; if(l>=100)return 'FINANCIAL MAX'; if(l>=75)return 'Financial Elite'; if(l>=50)return 'Wealth Builder'; if(l>=30)return 'Strategist'; if(l>=20)return 'Builder'; if(l>=10)return 'Controller'; if(l>=5)return 'Foundation'; return 'Awakening';}
}
